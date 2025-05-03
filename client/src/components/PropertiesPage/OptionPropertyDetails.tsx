import { FaPlus } from 'react-icons/fa6';
import { UpdateOptionInput } from '../../api/types/graphql';
import { OptionPill } from '../common/OptionPill';

import { useTranslation } from 'react-i18next';
import { MAX_OPTIONS_LENGTH } from '../../utils/constants';
import { ButtonIcon } from '../common/ButtonIcon';
import * as styles from './OptionPropertyDetails.css';
import { Property } from './useProperty';

export type OptionPropertyDetailsProps = {
  property: Property;
  addOption: (option: UpdateOptionInput) => void;
  editOption: (id: string, option: UpdateOptionInput) => void;
  removeOption: (id: string) => void;
  restoreOption: (id: string) => void;
};

export const OptionPropertyDetails = ({
  property,
  addOption,
  editOption,
  removeOption,
  restoreOption,
}: OptionPropertyDetailsProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      {Object.values(property.options).map((option) => (
        <OptionPill
          key={option.id}
          option={option}
          placeholder={t('properties.options.new')}
          deleted={option.isDeleted}
          onValueChange={(value) => editOption(option.id, { ...option, value })}
          onColorChange={(color) => editOption(option.id, { ...option, color })}
          onDelete={() => removeOption(option.id)}
          onRestore={() => restoreOption(option.id)}
          dataTestId="properties-list-item-option"
        />
      ))}

      <ButtonIcon
        icon={FaPlus}
        onClick={() => addOption({ value: '', color: null })}
        size={'small'}
        disabled={Object.keys(property.options).length >= MAX_OPTIONS_LENGTH}
        dataTestId="properties-list-item-option-add-btn"
      />
    </div>
  );
};
