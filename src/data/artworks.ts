export type Artwork = {
  id: string;
  title: string;
  filename: string;
  tags: string[];
  width: number;
  height: number;
};

export const artworks: Artwork[] = [
  {
    id: "star-beast",
    title: "Star Beast",
    filename: "star-beast.png",
    tags: ["creatures", "digital"],
    width: 893,
    height: 671,
  },
  {
    id: "dual-demons",
    title: "Dual Demons",
    filename: "dual-demons.png",
    tags: ["creatures", "digital"],
    width: 1024,
    height: 833,
  },
  {
    id: "beast-warrior",
    title: "Beast Warrior",
    filename: "beast-warrior.png",
    tags: ["creatures", "ink"],
    width: 818,
    height: 1002,
  },
];

export function getAllTags(items: Artwork[]): string[] {
  const tagSet = new Set<string>();
  for (const item of items) {
    for (const tag of item.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}
