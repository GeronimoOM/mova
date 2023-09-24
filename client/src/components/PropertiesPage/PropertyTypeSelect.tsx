import { Component, JSX, splitProps } from 'solid-js';
import { PropertyType } from '../../api/types/graphql';
import { IconTypes } from 'solid-icons';
import { BiRegularText } from 'solid-icons/bi';
import { ImRadioChecked } from 'solid-icons/im';
import { Icon } from '../common/Icon';

const propertyTypeToIcon: Record<PropertyType, IconTypes> = {
  [PropertyType.Text]: BiRegularText,
  [PropertyType.Option]: ImRadioChecked,
};

type PropertyTypeSelectProps = {
  selectedType: PropertyType;
  onSelectType: (type: PropertyType) => void;
  isDisabled?: boolean;
};

export const PropertyTypeSelect: Component<PropertyTypeSelectProps> = (
  props,
) => {
  return (
    <PropertyTypeIcon
      type={props.selectedType}
      classList={{
        'cursor-pointer': !props.isDisabled,
      }}
    />
  );
};

type PropertyTypeIconProps = JSX.HTMLAttributes<HTMLDivElement> & {
  type: PropertyType;
};

export const PropertyTypeIcon: Component<PropertyTypeIconProps> = (props) => {
  const [, otherProps] = splitProps(props, ['type']);
  const icon = propertyTypeToIcon[props.type];

  return <Icon icon={icon} {...otherProps} />;
};
