import landscapeAlpineLake from '../assets/images/landscape_alpine_lake_1791695494103.jpg';
import sunsetOceanCoastal from '../assets/images/sunset_ocean_coastal_1791695537299.jpg';
import portraitYoungWoman from '../assets/images/portrait_young_woman_1791695480567.jpg';
import portraitYoungMan from '../assets/images/portrait_young_man_1791695520543.jpg';

export interface SampleImageItem {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  sizeBytes: number;
}

export const SAMPLE_BATCH_ITEMS: SampleImageItem[] = [
  {
    id: 'sample-1',
    name: 'alpine-lake-panorama.jpg',
    url: landscapeAlpineLake,
    width: 1920,
    height: 1080,
    sizeBytes: 1845200,
  },
  {
    id: 'sample-2',
    name: 'sunset-ocean-coast.jpg',
    url: sunsetOceanCoastal,
    width: 1920,
    height: 1280,
    sizeBytes: 1540300,
  },
  {
    id: 'sample-3',
    name: 'portrait-young-woman.jpg',
    url: portraitYoungWoman,
    width: 1200,
    height: 1600,
    sizeBytes: 1220400,
  },
  {
    id: 'sample-4',
    name: 'urban-creative-man.jpg',
    url: portraitYoungMan,
    width: 1200,
    height: 1500,
    sizeBytes: 984500,
  },
];

export const SAMPLE_SPLIT_IMAGE: SampleImageItem = {
  id: 'split-sample',
  name: 'mountain-vista-hd.jpg',
  url: landscapeAlpineLake,
  width: 1800,
  height: 1200,
  sizeBytes: 1845200,
};

// SVG Path and points for cursive "John Doe" signature
export const DEFAULT_SIGNATURE_STROKES = [
  // J
  [
    { x: 70, y: 150 },
    { x: 75, y: 110 },
    { x: 90, y: 90 },
    { x: 120, y: 88 },
    { x: 140, y: 100 },
    { x: 145, y: 120 },
    { x: 140, y: 190 },
    { x: 130, y: 250 },
    { x: 115, y: 280 },
    { x: 95, y: 290 },
    { x: 80, y: 280 },
    { x: 82, y: 250 },
    { x: 110, y: 210 },
    { x: 150, y: 180 },
  ],
  // o - h - n
  [
    { x: 160, y: 190 },
    { x: 175, y: 175 },
    { x: 190, y: 180 },
    { x: 195, y: 200 },
    { x: 185, y: 215 },
    { x: 170, y: 210 },
    { x: 172, y: 185 },
    { x: 195, y: 190 },
    // to h
    { x: 210, y: 175 },
    { x: 215, y: 120 },
    { x: 218, y: 100 },
    { x: 215, y: 215 },
    { x: 225, y: 185 },
    { x: 245, y: 185 },
    { x: 255, y: 215 },
    // to n
    { x: 265, y: 188 },
    { x: 275, y: 215 },
    { x: 285, y: 188 },
    { x: 300, y: 215 },
    { x: 320, y: 210 },
  ],
  // D
  [
    { x: 350, y: 130 },
    { x: 355, y: 220 },
    { x: 345, y: 225 },
    { x: 340, y: 215 },
    { x: 345, y: 140 },
    { x: 370, y: 110 },
    { x: 410, y: 115 },
    { x: 430, y: 145 },
    { x: 430, y: 190 },
    { x: 405, y: 225 },
    { x: 370, y: 225 },
    { x: 395, y: 210 },
  ],
  // o - e
  [
    { x: 430, y: 195 },
    { x: 445, y: 180 },
    { x: 460, y: 185 },
    { x: 465, y: 205 },
    { x: 450, y: 220 },
    { x: 435, y: 215 },
    { x: 440, y: 190 },
    { x: 465, y: 195 },
    // e
    { x: 480, y: 190 },
    { x: 500, y: 180 },
    { x: 510, y: 195 },
    { x: 490, y: 210 },
    { x: 480, y: 215 },
    { x: 505, y: 215 },
    { x: 530, y: 210 },
  ],
  // flourish underline
  [
    { x: 140, y: 250 },
    { x: 220, y: 245 },
    { x: 350, y: 240 },
    { x: 480, y: 235 },
    { x: 550, y: 232 },
  ],
];
