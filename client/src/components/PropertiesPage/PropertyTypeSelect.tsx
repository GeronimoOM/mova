import { Component } from 'solid-js';
import { PropertyType } from '../../api/types/graphql';
import { IconTypes } from 'solid-icons';
import { BiRegularText } from 'solid-icons/bi';
import { BsUiRadiosGrid } from 'solid-icons/bs';
import { ImRadioChecked } from 'solid-icons/im';
import { Icon } from '../utils/Icon';

const propertyTypeToIcon: Record<PropertyType, IconTypes> = {
  [PropertyType.Text]: BiRegularText,
  [PropertyType.Option]: ImRadioChecked,
};

type PropertyTypeSelectProps = {
  selectedType: PropertyType;
  onSelectType: (type: PropertyType) => void;
  isDisabled?: boolean;
};

const PropertyTypeSelect: Component<PropertyTypeSelectProps> = (props) => {
  const icon = propertyTypeToIcon[props.selectedType];
  return (
    <Icon
      icon={icon}
      classList={{
        'cursor-pointer': !props.isDisabled,
      }}
    />
  );
};

export default PropertyTypeSelect;
