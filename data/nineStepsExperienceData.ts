import { NINE_STEPS, type StepData } from '../components/nine-steps/nineStepsData';

export interface NineStepExperienceData extends StepData {
  videoSrc: string | null;
  posterSrc: string | null;
  videoReady: boolean;
}

export const NINE_STEPS_EXPERIENCE: NineStepExperienceData[] = NINE_STEPS.map(
  (step) => ({
    ...step,
    videoSrc: null,
    posterSrc: null,
    videoReady: false,
  }),
);

export const NINE_STEPS_MAP_VIDEO = '/videos/nine-steps-map-flow.mp4';
export const NINE_STEPS_MAP_POSTER = '/images/nine-steps-map-poster.webp';

export const NINE_STEP_MARKERS = [
  { left: 9, top: 73 },
  { left: 22, top: 64 },
  { left: 34, top: 77 },
  { left: 46, top: 66 },
  { left: 50, top: 50 },
  { left: 64, top: 57 },
  { left: 75, top: 44 },
  { left: 84, top: 38 },
  { left: 91, top: 25 },
] as const;
