import {
  Color,
  OptionFieldsFragment,
  OptionUpdate,
  UpdateOptionInput,
} from '../api/types/graphql';

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

export function updatedOptions(
  options?: OptionFieldsFragment[],
  changes?: Array<UpdateOptionInput | OptionUpdate>,
): OptionFieldsFragment[] {
  return (changes ?? []).reduce((current, { id, value, color }) => {
    if (!value) {
      return current.filter((opt) => opt.id !== id);
    }

    const newOption: OptionFieldsFragment = {
      id: id!,
      value,
      color,
      __typename: 'Option',
    };
    const currentOptionIdx = current.findIndex((opt) => opt.id === id);
    if (currentOptionIdx === -1) {
      return [...current, newOption];
    }

    return current.toSpliced(currentOptionIdx, 1, newOption);
  }, options ?? []);
}
