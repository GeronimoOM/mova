import * as styles from './WordDetailsProperty.css';

import {
  PropertyFieldsFragment,
  UpdatePropertyValueInput,
} from '../../../api/types/graphql';
import { Input } from '../../common/Input';

export type WordDetailsPropertyProps = {
  property: PropertyFieldsFragment;
  wordProperty: UpdatePropertyValueInput | null;
  onChange: (value: UpdatePropertyValueInput) => void;
  simplified?: boolean;
};

export const WordDetailsProperty = ({
  property,
  wordProperty,
  onChange,
  simplified,
}: WordDetailsPropertyProps) => {
  return (
    <div className={styles.row}>
      <div className={styles.label}>{property.name}</div>
      <Input
        value={wordProperty?.text ?? ''}
        onChange={(text) =>
          onChange({
            id: property.id,
            text,
          })
        }
        disabled={simplified}
      />
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
      <Input value={''} onChange={() => {}} loading={true} />
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
