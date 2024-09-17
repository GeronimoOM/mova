import { IconType } from 'react-icons';
import { BsUiChecksGrid } from 'react-icons/bs';
import { PiChatCenteredTextFill } from 'react-icons/pi';
import { PropertyType } from '../../api/types/graphql';

export const typeToIcon: Record<PropertyType, IconType> = {
  [PropertyType.Text]: PiChatCenteredTextFill,
  [PropertyType.Option]: BsUiChecksGrid,
};

export const typeToLabel: Record<PropertyType, string> = {
  [PropertyType.Text]: 'properties.text',
  [PropertyType.Option]: 'properties.option',
};
