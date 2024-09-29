import { useState } from 'react';
import { FaAngleDoubleRight } from 'react-icons/fa';

import { BsFillLightbulbFill } from 'react-icons/bs';
import { FaCheck, FaMinus } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa6';

import {
  PropertyFieldsFragment,
  TextPropertyValueFieldsFragment,
  WordFieldsFullFragment,
} from '../../api/types/graphql';
import { Input } from '../common/Input';
import { SpellInput } from '../common/SpellInput';

import { useTranslation } from 'react-i18next';
import { PiGraphBold } from 'react-icons/pi';
import { Color } from '../../index.css';
import { ButtonIcon } from '../common/ButtonIcon';
import { Icon } from '../common/Icon';
import * as styles from './SpellExercise.css';

const NORMAL_REVEAL_PREFIX = 1;
const ADVANCED_REVEAL_PREFIX = 0;

export type SpellExerciseProps = {
  word: WordFieldsFullFragment;
  properties: PropertyFieldsFragment[];
  onSuccess: () => void;
  onFailure: () => void;
  onNext: () => void;
  advanced?: boolean;
};

type SpellProperty = {
  name: string | null;
  value: string;
};

export const SpellExercise: React.FC<SpellExerciseProps> = ({
  word,
  properties,
  onSuccess,
  onFailure,
  onNext,
  advanced,
}) => {
  const [{ name: propertyName, value: propertyValue }] =
    useState<SpellProperty>(() =>
      getSpellProperty(word, properties, advanced ?? false),
    );
  const [revealPrefix, setRevealPrefix] = useState(
    advanced ? ADVANCED_REVEAL_PREFIX : NORMAL_REVEAL_PREFIX,
  );
  const [input, setInput] = useState(propertyValue.slice(0, revealPrefix));
  const [result, setResult] = useState<boolean | null>(null);
  const [highlights, setHighlights] = useState<Array<Color | null>>(
    Array(revealPrefix).fill('primary'),
  );

  const { t } = useTranslation();

  const isSubmitted = result !== null;
  const canSubmit =
    !isSubmitted && (advanced || input.length === propertyValue.length);

  const handleInput = (value: string) => {
    if (value.length >= revealPrefix) {
      setInput(value);
    }
  };

  const handleSubmit = () => {
    if (input === propertyValue) {
      setResult(true);
      onSuccess();
    } else {
      setResult(false);
      onFailure();
    }

    setHighlights(
      propertyValue
        .split('')
        .map((char, i) => (char === input[i] ? 'primary' : 'negative')),
    );
  };

  const handleNext = () => {
    if (!isSubmitted) {
      handleSubmit();
    } else {
      onNext();
    }
  };

  const handleHint = () => {
    setRevealPrefix(NORMAL_REVEAL_PREFIX);
    setInput(
      propertyValue.slice(0, NORMAL_REVEAL_PREFIX) +
        input.slice(NORMAL_REVEAL_PREFIX),
    );
    setHighlights(Array(NORMAL_REVEAL_PREFIX).fill('primary'));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{t('exercise.spell')}</div>

      <Input
        value={word.translation}
        text="translation"
        size="large"
        onChange={() => {}}
        disabled
      />

      <div className={styles.propertyLabel}>
        <Icon icon={FaBookOpen} size="small" />
        {t('exercise.word')}
        {propertyName && (
          <>
            <span className={styles.propertyLabelDivider}>{'—'}</span>
            <Icon icon={PiGraphBold} size="small" />
            {propertyName}
          </>
        )}
      </div>

      <SpellInput
        value={isSubmitted ? propertyValue : input}
        onChange={handleInput}
        disabled={isSubmitted}
        length={propertyValue.length}
        obscureLength={advanced && !isSubmitted}
        highlights={highlights}
      />

      <div className={styles.result}>
        {advanced && (
          <ButtonIcon
            icon={BsFillLightbulbFill}
            onClick={handleHint}
            disabled={!canSubmit || revealPrefix !== ADVANCED_REVEAL_PREFIX}
          />
        )}

        <ButtonIcon
          icon={!isSubmitted || result ? FaCheck : FaMinus}
          color={!isSubmitted || result ? 'primary' : 'negative'}
          onClick={handleSubmit}
          disabled={!canSubmit}
        />

        <ButtonIcon
          icon={!isSubmitted ? FaMinus : FaAngleDoubleRight}
          {...(!isSubmitted && { color: 'negative' })}
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

function getSpellProperty(
  word: WordFieldsFullFragment,
  allProperties: PropertyFieldsFragment[],
  advanced: boolean,
): SpellProperty {
  let randomPropertyValue: TextPropertyValueFieldsFragment | null = null;
  let randomProperty: PropertyFieldsFragment | null = null;
  if (advanced) {
    const properties = [null, ...word.properties];
    randomPropertyValue = properties[
      Math.floor(Math.random() * properties.length)
    ] as TextPropertyValueFieldsFragment | null;
    randomProperty = allProperties.find(
      (prop) => prop.id === randomPropertyValue?.property.id,
    )!;
  }

  return randomPropertyValue && randomProperty
    ? { name: randomProperty.name, value: randomPropertyValue.text }
    : { name: null, value: word.original };
}
