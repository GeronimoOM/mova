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
};

export const WordDetailsProperty: React.FC<WordDetailsPropertyProps> = ({
  property,
  wordProperty,
  onChange,
}) => {
  return (
    <>
      <div className={styles.label}>{property.name}</div>
      <Input
        value={wordProperty?.text ?? ''}
        onChange={(text) =>
          onChange({
            id: property.id,
            text,
          })
        }
      />
    </>
  );
};

type WordDetailsPropertySkeletonProps = {
  length?: 'small' | 'medium' | 'large';
};

export const WordDetailsPropertySkeleton: React.FC<
  WordDetailsPropertySkeletonProps
> = ({ length }) => {
  return (
    <>
      <div className={styles.labelSkeleton({ length })} />
      <Input value={''} onChange={() => {}} loading={true} />
    </>
  );
};

export const WordDetailsPropertiesSkeleton: React.FC = () => {
  return (
    <>
      <WordDetailsPropertySkeleton length={'medium'} />
      <WordDetailsPropertySkeleton length={'small'} />
      <WordDetailsPropertySkeleton length={'large'} />
    </>
  );
};
