import * as styles from './WordDetailsProperty.css';

import { useMemo, useRef, useState } from 'react';
import {
  OptionPropertyFieldsFragment,
  OptionPropertyValueFieldsFragment,
  PropertyFieldsFragment,
  PropertyValueFieldsFragment,
  SavePropertyValueInput,
  TextPropertyFieldsFragment,
  TextPropertyValueFieldsFragment,
} from '../../../api/types/graphql';
import {
  isOptionPropertyFragment,
  isTextPropertyFragment,
} from '../../../utils/properties';
import { useWidthListener } from '../../../utils/useWidthListener';
import { Dropdown } from '../../common/Dropdown';
import { Input } from '../../common/Input';
import { OptionPill } from '../../common/OptionPill';
import { WordDetailsOptionDropdown } from './WordDetailsOptionsDropdown';

export type WordDetailsPropertyProps = {
  property: PropertyFieldsFragment;
  propertyValue: PropertyValueFieldsFragment | null;
  onChange: (value: SavePropertyValueInput) => void;
  simplified?: boolean;
};

export const WordDetailsProperty = ({
  property,
  propertyValue,
  onChange,
  simplified,
}: WordDetailsPropertyProps) => {
  return (
    <div className={styles.row} data-testid="word-details-property">
      <div className={styles.label}>{property.name}</div>

      {isTextPropertyFragment(property) && (
        <WordDetailsTextProperty
          property={property}
          propertyValue={propertyValue as TextPropertyValueFieldsFragment}
          onChange={onChange}
          simplified={simplified}
        />
      )}

      {isOptionPropertyFragment(property) && (
        <WordDetailsOptionProperty
          property={property}
          propertyValue={propertyValue as OptionPropertyValueFieldsFragment}
          onChange={onChange}
          simplified={simplified}
        />
      )}
    </div>
  );
};

export type WordDetailsTextPropertyProps = {
  property: TextPropertyFieldsFragment;
  propertyValue: TextPropertyValueFieldsFragment | null;
  onChange: (value: SavePropertyValueInput) => void;
  simplified?: boolean;
};

const WordDetailsTextProperty = ({
  property,
  propertyValue,
  onChange,
  simplified,
}: WordDetailsTextPropertyProps) => {
  return (
    <Input
      value={propertyValue?.text ?? ''}
      onChange={(text) =>
        onChange({
          id: property.id,
          text,
        })
      }
      disabled={simplified}
      maxLength={100}
      dataTestId="word-details-property-text"
    />
  );
};

export type WordDetailsOptionPropertyProps = {
  property: OptionPropertyFieldsFragment;
  propertyValue: OptionPropertyValueFieldsFragment | null;
  onChange: (value: SavePropertyValueInput) => void;
  simplified?: boolean;
};

const WordDetailsOptionProperty = ({
  property,
  propertyValue,
  onChange,
  simplified,
}: WordDetailsOptionPropertyProps) => {
  const [isOpen, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperWidth = useWidthListener(wrapperRef);

  const option = useMemo(() => {
    const option = propertyValue?.option ?? null;
    if (option?.id) {
      const propertyOption = property.options.find(
        (propertyOption) => propertyOption.id === option.id,
      );
      if (propertyOption) {
        return {
          id: option.id,
          value: propertyOption.value,
          color: propertyOption.color,
        };
      } else {
        return { value: option.value, color: option.color };
      }
    }

    return option;
  }, [property, propertyValue]);

  return (
    <div ref={wrapperRef} className={styles.optionWrapper}>
      <Dropdown
        isOpen={isOpen}
        onOpen={(isOpen) => !simplified && setOpen(isOpen)}
        content={
          <div style={{ width: wrapperWidth, boxSizing: 'border-box' }}>
            <WordDetailsOptionDropdown
              property={property}
              selected={option}
              onSelect={(option) =>
                onChange({
                  id: property.id,
                  option,
                })
              }
              onClose={() => setOpen(false)}
            />
          </div>
        }
        alignment="start"
      >
        <OptionPill
          option={option}
          disabled={simplified}
          dataTestId="word-details-property-option"
        />
      </Dropdown>
    </div>
  );
};

type WordDetailsPropertySkeletonProps = {
  length?: 'small' | 'medium' | 'large';
};

export const WordDetailsPropertySkeleton = ({
  length,
}: WordDetailsPropertySkeletonProps) => {
  return (
    <>
      <div className={styles.labelSkeleton({ length })} />
      <Input value={''} loading={true} />
    </>
  );
};

export const WordDetailsPropertiesSkeleton = () => {
  return (
    <>
      <WordDetailsPropertySkeleton length={'medium'} />
      <WordDetailsPropertySkeleton length={'small'} />
      <WordDetailsPropertySkeleton length={'large'} />
    </>
  );
};
