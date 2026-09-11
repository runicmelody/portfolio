// Dark-dungeon background shader for vgpu.
// Rising ember sparks, flickering forge glow, drifting magic dust
// (teal/violet motes) and heavy shadows — a dark-fantasy atmosphere.

struct Params {
  resolution: vec2f,
  time: f32,
}

@group(0) @binding(0) var<uniform> params: Params;

const TAU: f32 = 6.28318530718;

// ---------- noise helpers ----------

fn hash21(p: vec2f) -> f32 {
  var q = fract(p * vec2f(123.34, 456.21));
  q += vec2f(dot(q, q + vec2f(45.32)));
  return fract(q.x * q.y);
}

fn noise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2f(1.0, 0.0)), u.x),
    mix(hash21(i + vec2f(0.0, 1.0)), hash21(i + vec2f(1.0, 1.0)), u.x),
    u.y,
  );
}

fn fbm(p0: vec2f) -> f32 {
  var p = p0;
  var value = 0.0;
  var amplitude = 0.5;
  for (var i = 0; i < 4; i = i + 1) {
    value += amplitude * noise(p);
    p = mat2x2f(1.6, 1.2, -1.2, 1.6) * p + vec2f(11.7, 5.3);
    amplitude *= 0.5;
  }
  return value;
}

// ---------- ember sparks (rise from the forge glow) ----------

fn emberSparks(uv: vec2f, aspect: f32, time: f32) -> vec3f {
  var col = vec3f(0.0);
  for (var i = 0; i < 80; i = i + 1) {
    let fi = f32(i);
    let h1 = hash21(vec2f(fi, 7.7));
    let h2 = hash21(vec2f(fi, 91.3));
    let h3 = hash21(vec2f(fi, 33.1));

    // each spark: staggered start, own lifetime
    let cycle = 5.0 + 7.0 * h1;
    let t = fract(time / cycle + h2);

    // rising: start at bottom (uv.y = 1), move up toward 0
    let y = 1.0 - t;
    var x = 0.05 + 0.9 * h3;
    // gentle sway as it rises
    x += sin((t * 3.0 + h2 * TAU) * 2.0) * 0.028 * (1.0 - t * 0.6);

    // flicker per spark
    let flick = 0.55 + 0.45 * sin(time * (9.0 + 26.0 * h2) + fi * 1.7);

    let dx = (uv.x - x) * aspect;
    let dy = uv.y - y;
    // small bright core + vertical streak trailing below (updraft wake)
    let core = exp(-(dx * dx * 2600.0 + dy * dy * 2200.0));
    let streak = exp(-dx * dx * 5200.0) * exp(-max(dy, 0.0) * 120.0);
    let shape = core + streak * 0.9;

    // fade in at spawn, fade out near the top
    let life = smoothstep(0.0, 0.06, t) * (1.0 - smoothstep(0.88, 1.0, t));
    let bright = 0.16 + 0.4 * h1;

    col += vec3f(1.0, 0.42, 0.07) * shape * life * flick * bright;
  }
  return col;
}

// ---------- magic dust (teal/violet floating motes) ----------

fn moteLayer(uv: vec2f, scale: f32, drift: vec2f, time: f32, seed: f32, brightness: f32) -> vec3f {
  let g = uv * scale + drift * time;
  let cell = floor(g);
  let f = fract(g) - 0.5;
  let h = hash21(cell + vec2f(seed, seed * 3.7));
  let present = step(0.68, h); // sparse enough to read as motes
  if (present < 0.5) {
    return vec3f(0.0);
  }
  let jitter = vec2f(
    hash21(cell + vec2f(seed * 1.3 + 7.0, seed * 2.1)),
    hash21(cell + vec2f(seed + 19.0, 11.0)),
  ) - 0.5;
  let d = length(f - jitter * 0.55);
  let core = exp(-d * d * 320.0);
  let halo = exp(-d * d * 90.0) * 0.22;
  // slow magic shimmer
  let shimmer = 0.6 + 0.4 * sin(time * (0.8 + h * 3.0) + h * TAU * 3.0);
  let cool = hash21(cell + vec2f(seed * 5.0, 3.3));
  // teal -> violet
  let tint = mix(vec3f(0.20, 0.95, 1.0), vec3f(0.75, 0.55, 1.0), cool);
  return tint * (core + halo) * shimmer * brightness;
}

// ---------- forge glow (flickering warm light from below) ----------

fn forgeGlow(p: vec2f, time: f32) -> vec3f {
  // breathing flame flicker
  let flick =
    0.6 +
    0.26 * sin(time * 2.1) +
    0.16 * sin(time * 5.7 + 1.3) +
    0.10 * sin(time * 11.7 + 4.1);
  let g = vec2f(0.0, 1.35); // just below the bottom edge, center
  let d = length(p - g);
  let glow = exp(-d * d * 1.7);
  let warm = vec3f(1.0, 0.28, 0.05);
  // faint teal counter-light on the far side for depth
  let cool = exp(-dot(p - vec2f(0.0, -1.6), p - vec2f(0.0, -1.6)) * 0.8);
  return warm * glow * (0.028 + 0.02 * flick) + vec3f(0.05, 0.30, 0.38) * cool * 0.012;
}

// ---------- smoky / dusty ambient texture ----------

fn ambience(p: vec2f, time: f32) -> f32 {
  let n1 = fbm(p * 1.4 + vec2f(time * 0.006, -time * 0.004));
  let n2 = fbm(p * 2.6 + vec2f(-time * 0.009, time * 0.005) + vec2f(7.3, 2.1));
  // thin smoke: low, patchy brightness
  return (n1 - 0.35) * 0.5 + (n2 - 0.42) * 0.25;
}

// ---------- main ----------

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let time = params.time;
  let aspect = params.resolution.x / max(params.resolution.y, 1.0);
  let p = (uv * 2.0 - 1.0) * vec2f(aspect, 1.0);

  // base: near-black ceiling, faint ember-warm floor (uv.y: 0 top -> 1 bottom)
  var col = mix(
    vec3f(0.0035, 0.0030, 0.0050),
    vec3f(0.0220, 0.0110, 0.0075),
    smoothstep(0.0, 1.0, uv.y),
  );

  // cold violet magic tint drifting high up (spell residue)
  col += vec3f(0.35, 0.16, 0.65) * (1.0 - smoothstep(0.15, 0.75, uv.y)) * 0.012;

  // thin smoke
  let smoke = ambience(p * 0.35, time);
  col += vec3f(0.10, 0.07, 0.09) * max(smoke, 0.0) * 0.07;

  // flickering forge glow from below
  col += forgeGlow(p, time);

  // rising ember sparks
  col += emberSparks(uv, aspect, time);

  // drifting magic dust
  col += moteLayer(uv, 130.0, vec2f(0.03, -0.09), time, 1.0, 0.7);
  col += moteLayer(uv, 300.0, vec2f(-0.05, -0.13), time, 2.0, 1.05);
  col += moteLayer(uv, 720.0, vec2f(0.02, -0.10), time, 3.0, 1.3);

  // heavy vignette — dungeon darkness at the edges
  let v = smoothstep(1.55, 0.45, length(p));
  col *= mix(0.22, 1.0, v);

  // film grain (very subtle — keep it quiet on dark pixels)
  let grain = (hash21(uv * vec2f(1731.0, 977.0) + vec2f(time * 47.0, time * 23.0)) - 0.5) * 0.018;
  col += grain;

  // display gamma
  col = pow(max(col, vec3f(0.0)), vec3f(1.0 / 2.2));
  col = min(col, vec3f(1.0));

  return vec4f(col, 1.0);
}
