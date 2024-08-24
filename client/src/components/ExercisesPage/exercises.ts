export enum ExerciseType {
  Recall = 'recall',
  Spell = 'spell',
  SpellAdv = 'type',
}

export const masteryToExerciseType: Record<number, ExerciseType> = {
  0: ExerciseType.Recall,
  1: ExerciseType.Spell,
  2: ExerciseType.SpellAdv,
  3: ExerciseType.SpellAdv,
};
