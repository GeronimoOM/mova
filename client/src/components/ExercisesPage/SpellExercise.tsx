import { useState } from 'react';
import { FaAngleDoubleRight } from 'react-icons/fa';

import { FaCheck, FaMinus } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa6';

import {
  PropertyFieldsFragment,
  TextPropertyValueFieldsFragment,
  WordFieldsFullFragment,
} from '../../api/types/graphql';
import { Input } from '../common/Input';
import { SpellInput } from '../common/SpellInput';

import { PiGraphBold } from 'react-icons/pi';
import { Color } from '../../index.css';
import { ButtonIcon } from '../common/ButtonIcon';
import { Icon } from '../common/Icon';
import * as styles from './SpellExercise.css';

const REVEAL_PREFIX = 1;

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
  const [input, setInput] = useState(propertyValue.slice(0, REVEAL_PREFIX));
  const [result, setResult] = useState<boolean | null>(null);
  const [highlights, setHighlights] = useState<Array<Color | null>>([]);

  const isSubmitted = result !== null;
  const canSubmit =
    !isSubmitted && (advanced || input.length === propertyValue.length);

  const handleInput = (value: string) => {
    if (value.length >= REVEAL_PREFIX) {
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Spell the word</div>

      <Input
        value={word.translation}
        text="translation"
        size="large"
        onChange={() => {}}
        disabled
      />

      <div className={styles.propertyLabel}>
        <Icon icon={FaBookOpen} size="small" />
        {'word'}
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
        <ButtonIcon
          icon={!isSubmitted || result ? FaCheck : FaMinus}
          color={!isSubmitted || result ? 'primary' : 'negative'}
          onClick={handleSubmit}
          disabled={!canSubmit}
        />

        <ButtonIcon
          icon={FaAngleDoubleRight}
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
