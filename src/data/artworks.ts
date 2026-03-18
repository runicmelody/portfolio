export type Artwork = {
  id: string;
  filename: string;
  tags: string[];
  width: number;
  height: number;
};

export const artworks: Artwork[] = [
  {
      "id": "in-the-depths-wacom-x-magma-come-draw-fishesss-1",
      "filename": "_In the Depths_ wacom x magma COME DRAW FISHESSS(1).png",
      "tags": [],
      "width": 3433,
      "height": 1931
    },
  {
      "id": "art-practice",
      "filename": "ART PRACTICE.png",
      "tags": [],
      "width": 540,
      "height": 432
    },
  {
      "id": "dddrawww-5",
      "filename": "dddrawww(5).png",
      "tags": [],
      "width": 1200,
      "height": 960
    },
  {
      "id": "draw-my-oc-2",
      "filename": "DRAW my oc(2).png",
      "tags": [],
      "width": 1147,
      "height": 1792
    },
  {
      "id": "draw-the-guy-in-the-corner",
      "filename": "draw the guy in the corner.png",
      "tags": [],
      "width": 863,
      "height": 1078
    },
  {
      "id": "freedraw-27",
      "filename": "freedraw(27).png",
      "tags": [],
      "width": 468,
      "height": 374
    },
  {
      "id": "frenss-2",
      "filename": "frenss(2).png",
      "tags": [],
      "width": 807,
      "height": 1130
    },
  {
      "id": "have-fun-drawing-18",
      "filename": "Have fun drawing, 楽しんで絵を描いてください, 즐겁게 그림을 그리세요(18).png",
      "tags": [],
      "width": 860,
      "height": 688
    },
  {
      "id": "have-fun-drawing-29",
      "filename": "Have fun drawing, 楽しんで絵を描いてください, 즐겁게 그림을 그리세요(29).png",
      "tags": [],
      "width": 745,
      "height": 801
    },
  {
      "id": "hello-free-draw-1",
      "filename": "hello free draw(1).png",
      "tags": [],
      "width": 1030,
      "height": 858
    },
  {
      "id": "im-brainstorming-designs-join-if-u-want",
      "filename": "Im brainstorming designs join if u want.png",
      "tags": [],
      "width": 807,
      "height": 645
    },
  {
      "id": "descenr",
      "filename": "descenr.png",
      "tags": [],
      "width": 1242,
      "height": 1227
    },
  {
      "id": "letsgo-74",
      "filename": "letsgo(74).png",
      "tags": [],
      "width": 954,
      "height": 1907
    },
  {
      "id": "lol2-2",
      "filename": "Lol2(2).png",
      "tags": [],
      "width": 432,
      "height": 540
    },
  {
      "id": "new-drawing-13",
      "filename": "New Drawing (13).png",
      "tags": [],
      "width": 349,
      "height": 515
    },
  {
      "id": "new-drawing-8-2",
      "filename": "New Drawing(8).png",
      "tags": [],
      "width": 782,
      "height": 625
    },
  {
      "id": "new-drawing-9",
      "filename": "New Drawing(9).png",
      "tags": [],
      "width": 581,
      "height": 726
    },
  {
      "id": "new-drawing2-6",
      "filename": "New Drawing2(6).png",
      "tags": [],
      "width": 1562,
      "height": 1952
    },
  {
      "id": "new-drawing2-13",
      "filename": "New Drawing2(13).png",
      "tags": [],
      "width": 594,
      "height": 475
    },
  {
      "id": "new-drawing2-14",
      "filename": "New Drawing2(14).png",
      "tags": [],
      "width": 864,
      "height": 1080
    },
  {
      "id": "oc-arena-oc-s-challenge-draw-ur-ocs-3",
      "filename": "OC ARENA [OC'S CHALLENGE-DRAW UR OCS] (3).png",
      "tags": [],
      "width": 625,
      "height": 646
    },
  {
      "id": "screenshot-2025-06-15-171201",
      "filename": "Screenshot 2025-06-15 171201.png",
      "tags": [],
      "width": 644,
      "height": 754
    },
  {
      "id": "image-1-copy-1",
      "filename": "早上好中午好下午好晚上好 - Image 1 Copy(1).png",
      "tags": [],
      "width": 885,
      "height": 708
    },
  {
      "id": "image-1-1",
      "filename": "早上好中午好下午好晚上好 - Image 1(1).png",
      "tags": [],
      "width": 1221,
      "height": 976
    },
  {
      "id": "2",
      "filename": "暇な人あつまれ〜(2).png",
      "tags": [],
      "width": 653,
      "height": 522
    },
  {
      "id": "2-2",
      "filename": "画一会(2).png",
      "tags": [],
      "width": 886,
      "height": 755
    },
  {
      "id": "2-3",
      "filename": "画画是你的神经 (2).png",
      "tags": [],
      "width": 339,
      "height": 326
    },
  {
      "id": "artwork-9",
      "filename": "画画是你的神经.png",
      "tags": [],
      "width": 327,
      "height": 342
    },
  {
      "id": "4",
      "filename": "画画直到我不画了(4).png",
      "tags": [],
      "width": 868,
      "height": 1085
    }
] as Artwork[];

export function getAllTags(items: Artwork[]): string[] {
  const tagSet = new Set<string>();
  for (const item of items) {
    for (const tag of item.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}
