import { Color } from '../api/types/graphql';

export type OptionColor = Color;

export const optionColors: OptionColor[] = [
  Color.Red,
  Color.Orange,
  Color.Yellow,
  Color.Green,
  Color.Teal,
  Color.Blue,
  Color.Purple,
  Color.Pink,
  Color.Brown,
];

export const toThemeOptionColor = (color: Color) =>
  color.toLowerCase() as Lowercase<OptionColor>;
