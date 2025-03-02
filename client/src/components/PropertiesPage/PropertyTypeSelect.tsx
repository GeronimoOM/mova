import classNames from 'classnames';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PropertyType } from '../../api/types/graphql';
import { propertyTypes } from '../../utils/properties';
import { useClickOutsideHandler } from '../../utils/useClickOutsideHandler';
import { Icon } from '../common/Icon';
import { propertyTypeToIcon, propertyTypeToLabel } from './properties';
import * as styles from './PropertyTypeSelect.css';

export type PropertyTypeSelectProps = {
  propertyType: PropertyType;
  onPropertyTypeSelect: (propertyType: PropertyType) => void;
  disabled?: boolean;
};

export const PropertyTypeSelect = ({
  propertyType,
  onPropertyTypeSelect,
  disabled,
}: PropertyTypeSelectProps) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handlePropertyTypeSelect = (propertyType: PropertyType) => {
    if (isSelectOpen) {
      onPropertyTypeSelect(propertyType);
      setIsSelectOpen(false);
    } else {
      setIsSelectOpen(true);
    }
  };

  useClickOutsideHandler({
    ref: selectRef,
    onClick: () => setIsSelectOpen(false),
  });

  return (
    <div
      className={classNames(styles.wrapper, { disabled })}
      ref={selectRef}
      onClick={() => !disabled && setIsSelectOpen(!isSelectOpen)}
    >
      {isSelectOpen ? (
        propertyTypes.map((type) => (
          <PropertyTypePill
            key={type}
            propertyType={type}
            onSelect={handlePropertyTypeSelect}
            selected={type === propertyType}
          />
        ))
      ) : (
        <PropertyTypePill
          propertyType={propertyType}
          onSelect={handlePropertyTypeSelect}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export type PropertyTypePillProps = {
  propertyType: PropertyType;
  onSelect: (propertyType: PropertyType) => void;
  selected?: boolean;
  disabled?: boolean;
};

export const PropertyTypePill = ({
  propertyType,
  onSelect,
  selected,
  disabled,
}: PropertyTypePillProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(styles.pill, {
        selected,
        disabled,
      })}
      onClick={() => !disabled && onSelect(propertyType)}
    >
      <Icon icon={propertyTypeToIcon[propertyType]} size="medium" />
      <span className={styles.typeLabel}>
        {t(propertyTypeToLabel[propertyType])}
      </span>
    </div>
  );
};
