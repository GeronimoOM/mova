import { IconTypes } from 'solid-icons';
import { TbCards, TbTextRecognition } from 'solid-icons/tb';
import { FaSolidKeyboard } from 'solid-icons/fa';

export enum ExerciseType {
  Cards = '/cards',
  Typing = '/typing',
}

export type ExerciseProps = {
  title: string;
  icon: IconTypes;
  route: ExerciseType;
};

export const exercisesProps: Record<ExerciseType, ExerciseProps> = {
  [ExerciseType.Cards]: {
    title: 'Cards',
    icon: TbCards,
    route: ExerciseType.Cards,
  },
  [ExerciseType.Typing]: {
    title: 'Typing',
    icon: FaSolidKeyboard,
    route: ExerciseType.Typing,
  },
};
