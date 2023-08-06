import { IconTypes } from 'solid-icons';
import { CgCardDiamonds } from 'solid-icons/cg';

export enum ExerciseType {
  Cards = 'Cards',
}

export enum ExerciseRoute {
  Cards = '/cards'
}

export type ExerciseProps = {
  title: string;
  icon: IconTypes;
  route: ExerciseRoute;
}

export const exercisesProps: Record<ExerciseType, ExerciseProps> = {
  [ExerciseType.Cards]: {
    title: 'Cards',
    icon: CgCardDiamonds,
    route: ExerciseRoute.Cards,
  },
}

