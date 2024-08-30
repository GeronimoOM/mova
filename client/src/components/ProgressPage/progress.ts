import { IconType } from 'react-icons';
import { FaBook, FaBrain } from 'react-icons/fa6';
import { ProgressCadence, ProgressType } from '../../api/types/graphql';
import { Color } from '../../index.css';

export const progressTypeToColor: Record<ProgressType, Color> = {
  [ProgressType.Mastery]: 'secondary1',
  [ProgressType.Words]: 'secondary2',
};

export const progressTypeToIcon: Record<ProgressType, IconType> = {
  [ProgressType.Mastery]: FaBrain,
  [ProgressType.Words]: FaBook,
};

export const ProgressTypes = [
  ProgressType.Words,
  ProgressType.Mastery,
] as const;

export const ProgressCadences = [
  ProgressCadence.Daily,
  ProgressCadence.Weekly,
] as const;
