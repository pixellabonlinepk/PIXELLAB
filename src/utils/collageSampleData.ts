import portraitYoungWoman from '../assets/images/portrait_young_woman_1791695480567.jpg';
import portraitYoungMan from '../assets/images/portrait_young_man_1791695520543.jpg';
import portraitAdultWoman from '../assets/images/portrait_adult_woman_1791695506600.jpg';
import portraitWomanRedBlazer from '../assets/images/portrait_woman_red_blazer_1791695816563.jpg';
import cartoonYoungMan from '../assets/images/cartoon_young_man_1791695763624.jpg';
import faceBeautyCloseup from '../assets/images/face_beauty_closeup_1791695871827.jpg';
import faceRetouchSmooth from '../assets/images/face_retouch_smooth_1791695933370.jpg';
import landscapeAlpineLake from '../assets/images/landscape_alpine_lake_1791695494103.jpg';
import sunsetOceanCoastal from '../assets/images/sunset_ocean_coastal_1791695537299.jpg';

export interface SampleAvatarItem {
  id: string;
  name: string;
  role: string;
  url: string;
}

export const SAMPLE_AVATARS: SampleAvatarItem[] = [
  {
    id: 'avatar-1',
    name: 'Sophia',
    role: 'Creative Lead',
    url: portraitYoungWoman,
  },
  {
    id: 'avatar-2',
    name: 'Marcus',
    role: 'Developer',
    url: portraitYoungMan,
  },
  {
    id: 'avatar-3',
    name: 'Elena',
    role: 'Product Designer',
    url: portraitAdultWoman,
  },
  {
    id: 'avatar-4',
    name: 'Sarah',
    role: 'Team Captain',
    url: portraitWomanRedBlazer,
  },
  {
    id: 'avatar-5',
    name: 'Alex',
    role: 'Visual Artist',
    url: cartoonYoungMan,
  },
  {
    id: 'avatar-6',
    name: 'Aria',
    role: 'Photographer',
    url: faceBeautyCloseup,
  },
  {
    id: 'avatar-7',
    name: 'David',
    role: 'Strategy',
    url: faceRetouchSmooth,
  },
  {
    id: 'avatar-8',
    name: 'Alpine Lake',
    role: 'Scenic Nature',
    url: landscapeAlpineLake,
  },
  {
    id: 'avatar-9',
    name: 'Sunset Coast',
    role: 'Golden Hour',
    url: sunsetOceanCoastal,
  },
];
