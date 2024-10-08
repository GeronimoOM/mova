export type Mastery = 0 | 1 | 2 | 3;

export const masteries = [0, 1, 2, 3] as const;

export const MaxMastery = 3;

export const masteryToColor: Record<Mastery, string> = {
  0: '#fbeaf2',
  1: '#f3bfd7',
  2: '#e77eaf',
  3: '#dc5794',
};

export const masteryToLabel: Record<Mastery, string> = {
  0: 'mastery.none',
  1: 'mastery.basic',
  2: 'mastery.advanced',
  3: 'mastery.mastered',
};
