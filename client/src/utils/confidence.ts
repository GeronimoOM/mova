export type Confidence = -2 | -1 | 0 | 1 | 2 | 3;

export const confidences = [-2, -1, 0, 1, 2, 3] as const;

export const MaxConfidence = 3;

export const confidenceToColor: Record<Confidence, string> = {
  [-2]: '#ef8354',
  [-1]: '#f0b399',
  [0]: '#fbeaf2',
  [1]: '#a4cff5',
  [2]: '#64a6e1',
  [3]: '#1c7ed4',
};

export const confidenceToLabel: Record<Confidence, string> = {
  [-2]: 'confidence.lowest',
  [-1]: 'confidence.low',
  [0]: 'confidence.normal',
  [1]: 'confidence.high',
  [2]: 'confidence.higher',
  [3]: 'confidence.highest',
};
