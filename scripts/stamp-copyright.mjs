#!/usr/bin/env node
/**
 * Portfolyo görsellerine telif hakkı metadata'sı gömer — piksel verisine
 * DOKUNMADAN, harici araç (exiftool vb.) gerektirmeden.
 *
 * Ne ekler:
 *   • iTXt  → XMP paketi: dc:creator, dc:rights, cc:license, cc:attributionName,
 *             xmpRights:Marked / WebStatement / UsageTerms
 *             (Creative Commons ve Google Görseller bu alanları okur)
 *   • eXIf  → Artist / Copyright / ImageDescription
 *             (Windows "Özellikler → Ayrıntılar", macOS Önizleme)
 *   • tEXt  → Copyright / Author / Description  (basit okuyucular)
 *
 * Neden önemli: metadata dosyanın İÇİNE yazılır. Görsel indirilip başka bir
 * sitede kullanılsa bile "kimin, hangi lisansla" olduğu dosyayla birlikte
 * taşınır. Görünmez ama silinmesi için kasten uğraşılması gerekir.
 *
 * Kullanım:
 *   node scripts/stamp-copyright.mjs            # public/artworks içine yazar
 *   node scripts/stamp-copyright.mjs --check    # sadece rapor verir, yazmaz
 *   node scripts/stamp-copyright.mjs --dir public/artworks
 *
 * Idempotent: ikinci çalıştırmada zaten damgalı dosyaları atlar.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ---------------------------------------------------------------------------
// Yapılandırma — site verileriyle aynı kalmalı (src/data/site.ts)
// ---------------------------------------------------------------------------
const config = JSON.parse(readFileSync(join(rootDir, 'scripts', 'copyright.config.json'), 'utf8'));
const { author, siteUrl, licenceName, licenceUrl, licencePage, email } = config;

const YEAR = new Date().getFullYear();
const COPYRIGHT = `© ${YEAR} ${author}. Licensed ${licenceName} — ${licenceUrl}. No AI training. ${licencePage}`;
const XMP_MARKER = 'ahmet-portfolio/copyright';

// ---------------------------------------------------------------------------
// PNG chunk altyapısı
// ---------------------------------------------------------------------------
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'latin1');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([length, typeBuf, data, crc]);
}

function parseChunks(png) {
  const chunks = [];
  let offset = 8;
  while (offset + 8 <= png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.toString('latin1', offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (dataEnd + 4 > png.length) break;
    chunks.push({ type, start: offset, end: dataEnd + 4, data: png.subarray(dataStart, dataEnd) });
    offset = dataEnd + 4;
    if (type === 'IEND') break;
  }
  return chunks;
}

// ---------------------------------------------------------------------------
// Metadata üreticileri
// ---------------------------------------------------------------------------
function textChunk(keyword, value) {
  return makeChunk('tEXt', Buffer.concat([
    Buffer.from(keyword, 'latin1'),
    Buffer.from([0]),
    Buffer.from(value, 'latin1'),
  ]));
}

function xmpChunk(xmp) {
  return makeChunk('iTXt', Buffer.concat([
    Buffer.from('XML:com.adobe.xmp', 'latin1'),
    Buffer.from([0]), // keyword sonu
    Buffer.from([0]), // sıkıştırma bayrağı: sıkıştırılmamış
    Buffer.from([0]), // sıkıştırma yöntemi
    Buffer.from('', 'latin1'), // dil etiketi
    Buffer.from([0]),
    Buffer.from('', 'utf8'), // çevrilmiş anahtar kelime
    Buffer.from([0]),
    Buffer.from(xmp, 'utf8'),
  ]));
}

/**
 * TIFF/EXIF bloğu üretir (PNG eXIf chunk'ı "Exif\0\0" başlığı İÇERMEZ).
 */
function exifChunk(fields) {
  const entries = fields.map(([tag, value]) => ({
    tag,
    buf: Buffer.from(`${value}\0`, 'latin1'),
  }));

  const ifdLength = 2 + entries.length * 12 + 4;
  const dataStart = 8 + ifdLength;
  const ifd = Buffer.alloc(ifdLength);
  ifd.writeUInt16LE(entries.length, 0);

  const dataChunks = [];
  let dataOffset = dataStart;

  entries.forEach((entry, index) => {
    const p = 2 + index * 12;
    ifd.writeUInt16LE(entry.tag, p); // tag
    ifd.writeUInt16LE(2, p + 2); // tip: ASCII
    ifd.writeUInt32LE(entry.buf.length, p + 4); // adet
    if (entry.buf.length <= 4) {
      entry.buf.copy(ifd, p + 8);
    } else {
      ifd.writeUInt32LE(dataOffset, p + 8);
      dataChunks.push(entry.buf);
      const pad = entry.buf.length % 2;
      if (pad) dataChunks.push(Buffer.alloc(1));
      dataOffset += entry.buf.length + pad;
    }
  });

  ifd.writeUInt32LE(0, 2 + entries.length * 12); // sonraki IFD yok

  // "II" + 0x002A + IFD0 ofseti (8)
  const header = Buffer.from([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00]);
  return makeChunk('eXIf', Buffer.concat([header, ifd, ...dataChunks]));
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildXmp(title) {
  return `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/">
   <dc:creator><rdf:Seq><rdf:li>${xmlEscape(author)}</rdf:li></rdf:Seq></dc:creator>
   <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${xmlEscape(COPYRIGHT)}</rdf:li></rdf:Alt></dc:rights>
   <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${xmlEscape(title)}</rdf:li></rdf:Alt></dc:title>
   <cc:license rdf:resource="${licenceUrl}"/>
   <cc:attributionName>${xmlEscape(author)}</cc:attributionName>
   <cc:attributionURL rdf:resource="${siteUrl}"/>
   <cc:morePermissions rdf:resource="${licencePage}"/>
   <xmpRights:Marked>True</xmpRights:Marked>
   <xmpRights:WebStatement>${licencePage}</xmpRights:WebStatement>
   <xmpRights:UsageTerms><rdf:Alt><rdf:li xml:lang="x-default">${xmlEscape(COPYRIGHT)}</rdf:li></rdf:Alt></xmpRights:UsageTerms>
   <xmpRights:Owner><rdf:Bag><rdf:li>${xmlEscape(author)}</rdf:li></rdf:Bag></xmpRights:Owner>
   <dc:description><rdf:Alt><rdf:li xml:lang="x-default">${XMP_MARKER} · ${xmlEscape(email)}</rdf:li></rdf:Alt></dc:description>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

function titleFromFilename(file) {
  return file
    .replace(/\.[^.]+$/, '')
    .replace(/^\d{4}-\d{2}-\d{2}[_-]/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

// ---------------------------------------------------------------------------
// Damgalama
// ---------------------------------------------------------------------------
function isStamped(png) {
  return png.includes(XMP_MARKER);
}

function stampPng(buffer, title) {
  const chunks = parseChunks(buffer);
  if (chunks.length === 0) throw new Error('geçersiz PNG: chunk bulunamadı');

  const stale = new Set(['eXIf']);
  const keep = chunks.filter((chunk) => {
    if (stale.has(chunk.type)) return false;
    if (chunk.type === 'tEXt') {
      const keyword = chunk.data.toString('latin1').split('\0')[0];
      return !['Copyright', 'Author', 'Artist', 'Description', 'Software'].includes(keyword);
    }
    if (chunk.type === 'iTXt') {
      const keyword = chunk.data.toString('latin1').split('\0')[0];
      return keyword !== 'XML:com.adobe.xmp';
    }
    return true;
  });

  const insertAfter = keep.findIndex((c) => c.type === 'IHDR');
  if (insertAfter === -1) throw new Error('geçersiz PNG: IHDR yok');

  const injected = [
    xmpChunk(buildXmp(title)),
    exifChunk([
      [0x010e, title], // ImageDescription
      [0x0131, 'Ahmet illustration portfolio'], // Software
      [0x013b, author], // Artist
      [0x8298, `© ${YEAR} ${author}`], // Copyright (EXIF)
    ]),
    textChunk('Title', title),
    textChunk('Author', author),
    textChunk('Copyright', COPYRIGHT),
    textChunk('Description', `${title} — ${licenceName}`),
    textChunk('Software', 'stamp-copyright.mjs'),
  ];

  const parts = [PNG_SIG];
  keep.forEach((chunk, index) => {
    parts.push(buffer.subarray(chunk.start, chunk.end));
    if (index === insertAfter) parts.push(...injected);
  });

  return Buffer.concat(parts);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const dirArgIndex = args.indexOf('--dir');
const targetDir = resolve(
  rootDir,
  dirArgIndex !== -1 ? args[dirArgIndex + 1] : join('public', 'artworks')
);

if (!statSync(targetDir, { throwIfNoEntry: false })) {
  console.error(`✗ Klasör bulunamadı: ${targetDir}`);
  process.exit(1);
}

const files = walk(targetDir);
const pngs = files.filter((f) => extname(f).toLowerCase() === '.png');
const skipped = files.filter((f) => extname(f).toLowerCase() !== '.png');

let stamped = 0;
let already = 0;
let bytesAdded = 0;
const failures = [];

for (const file of pngs) {
  const rel = relative(rootDir, file).split('\\').join('/');
  try {
    const original = readFileSync(file);
    if (!original.subarray(0, 8).equals(PNG_SIG)) {
      failures.push(`${rel} (PNG imzası yok)`);
      continue;
    }
    if (isStamped(original)) {
      already += 1;
      continue;
    }
    if (checkOnly) {
      stamped += 1;
      continue;
    }
    const output = stampPng(original, titleFromFilename(file));
    writeFileSync(file, output);
    bytesAdded += output.length - original.length;
    stamped += 1;
  } catch (err) {
    failures.push(`${rel} (${err.message})`);
  }
}

const verb = checkOnly ? 'damgalanacak' : 'damgalandı';
console.log(`${checkOnly ? '◻' : '✓'} ${stamped} PNG ${verb}, ${already} zaten damgalı`);
if (!checkOnly && bytesAdded > 0) {
  console.log(`  eklenen metadata: ${(bytesAdded / 1024).toFixed(1)} KB`);
}
if (skipped.length) {
  console.log(`• ${skipped.length} PNG olmayan dosya atlandı (${[...new Set(skipped.map((f) => extname(f)))].join(', ')})`);
}
if (failures.length) {
  console.log(`✗ ${failures.length} dosya işlenemedi:`);
  failures.forEach((f) => console.log(`    ${f}`));
  process.exitCode = 1;
}
if (checkOnly && stamped > 0) {
  console.log('  yazmak için: node scripts/stamp-copyright.mjs');
}
