import { useEffect, useMemo, useState } from 'react';
import { FaAngleDoubleRight } from 'react-icons/fa';

import { BsFillLightbulbFill } from 'react-icons/bs';
import { FaCheck, FaMinus } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa6';

import {
  PropertyFieldsFragment,
  TextPropertyFieldsFragment,
  TextPropertyValueFieldsFragment,
  WordFieldsFullFragment,
} from '../../api/types/graphql';
import { Input } from '../common/Input';
import { SpellInput } from '../common/SpellInput';

import { useTranslation } from 'react-i18next';
import { AccentColor } from '../../index.css';
import { ButtonIcon } from '../common/ButtonIcon';
import { Icon } from '../common/Icon';
import * as styles from './SpellExercise.css';

const NORMAL_REVEAL_PREFIX = 1;
const ADVANCED_REVEAL_PREFIX = 0;
const EXTRA_CHARACTERS_CHAR = '_';
const ADVANCED_MAX_PROPERTIES = 2;

export type SpellExerciseProps = {
  word: WordFieldsFullFragment;
  properties: PropertyFieldsFragment[];
  onSuccess: () => void;
  onFailure: () => void;
  onNext: () => void;
  advanced?: boolean;
};

export const SpellExercise = ({
  word,
  properties,
  onSuccess,
  onFailure,
  onNext,
  advanced,
}: SpellExerciseProps) => {
  const [revealPrefix, setRevealPrefix] = useState(
    advanced ? ADVANCED_REVEAL_PREFIX : NORMAL_REVEAL_PREFIX,
  );
  const [isSubmitted, setSubmitted] = useState<boolean>(false);
  const [wordProperties] = useState(() =>
    advanced ? getExerciseProperties(word, properties) : [],
  );
  const [partialResults, setPartialResults] = useState<Record<string, boolean>>(
    {},
  );
  const [result, setResult] = useState<boolean | null>(null);
  const hasResult = result !== null;

  const { t } = useTranslation();

  useEffect(() => {
    const partialResultValues = Object.values(partialResults);
    if (hasResult || partialResultValues.length < wordProperties.length + 1) {
      return;
    }

    const result = partialResultValues.every((value) => value);
    setResult(result);
    if (result) {
      onSuccess();
    } else {
      onFailure();
    }
  }, [hasResult, partialResults, onFailure, onSuccess, wordProperties]);

  const handlePartialResult = (propertyId: string, result: boolean) => {
    setPartialResults((results) => ({ ...results, [propertyId]: result }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
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
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{t('exercise.spell')}</div>

      <Input
        value={word.translation}
        text="translation"
        size="large"
        disabled
      />

      <SpellTextExerciseProperty
        word={word}
        property={null}
        isSubmitted={isSubmitted}
        revealPrefix={revealPrefix}
        advanced={advanced}
        onResult={(result) => handlePartialResult('original', result)}
      />

      {wordProperties.map((property) => (
        <SpellTextExerciseProperty
          key={property.id}
          word={word}
          property={property as TextPropertyFieldsFragment}
          isSubmitted={isSubmitted}
          revealPrefix={revealPrefix}
          advanced={advanced}
          onResult={(result) => handlePartialResult(property.id, result)}
        />
      ))}

      <div className={styles.result}>
        {advanced && (
          <ButtonIcon
            icon={BsFillLightbulbFill}
            onClick={handleHint}
            disabled={isSubmitted || revealPrefix !== ADVANCED_REVEAL_PREFIX}
          />
        )}

        <ButtonIcon
          icon={!hasResult || result ? FaCheck : FaMinus}
          color={!hasResult || result ? 'primary' : 'negative'}
          onClick={handleSubmit}
          disabled={isSubmitted}
          toggled={hasResult}
        />

        <ButtonIcon
          icon={!hasResult ? FaMinus : FaAngleDoubleRight}
          {...(!hasResult && { color: 'negative' })}
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

type SpellTextExercisePropertyProps = {
  word: WordFieldsFullFragment;
  property: TextPropertyFieldsFragment | null;
  isSubmitted: boolean;
  revealPrefix: number;
  advanced?: boolean;
  onResult: (result: boolean) => void;
};

const SpellTextExerciseProperty = ({
  word,
  property,
  isSubmitted,
  revealPrefix,
  advanced,
  onResult,
}: SpellTextExercisePropertyProps) => {
  const propertyValue = useMemo(() => {
    if (!property) {
      return word.original;
    }

    const wordProperty = word.properties.find(
      (prop) => prop.property.id === property.id,
    ) as TextPropertyValueFieldsFragment;
    return wordProperty.text;
  }, [word, property]);

  const [input, setInput] = useState(propertyValue.slice(0, revealPrefix));
  const [highlights, setHighlights] = useState<Array<AccentColor | null>>(
    Array(revealPrefix).fill('primary'),
  );

  const { t } = useTranslation();

  useEffect(() => {
    setInput(
      (input) =>
        propertyValue.slice(0, revealPrefix) + input.slice(revealPrefix),
    );
    setHighlights(Array(revealPrefix).fill('primary'));
  }, [propertyValue, revealPrefix]);

  const handleInput = (value: string) => {
    if (value.length >= revealPrefix) {
      setInput(value);
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      onResult(input === propertyValue);

      let verifiedInput = propertyValue;
      const verifiedHighlights = propertyValue
        .split('')
        .map((char, i) => (char === input[i] ? 'primary' : 'negative'));
      if (
        input.length > propertyValue.length &&
        input.slice(0, propertyValue.length) === propertyValue
      ) {
        verifiedInput += EXTRA_CHARACTERS_CHAR;
        verifiedHighlights.push('negative');
      }

      setInput(verifiedInput);
      setHighlights(verifiedHighlights);
    }
  }, [input, isSubmitted, propertyValue, onResult]);

  return (
    <div className={styles.property}>
      <div className={styles.propertyLabel}>
        {!property && <Icon icon={FaBookOpen} size="small" />}
        {!property ? t('exercise.word') : property.name}
      </div>
      <SpellInput
        value={input}
        onChange={handleInput}
        disabled={isSubmitted}
        length={isSubmitted ? input.length : propertyValue.length}
        obscureLength={advanced && !isSubmitted}
        highlights={highlights}
      />
    </div>
  );
};

function getExerciseProperties(
  word: WordFieldsFullFragment,
  allProperties: PropertyFieldsFragment[],
): PropertyFieldsFragment[] {
  const wordPropertyIds = word.properties.map((prop) => prop.property.id);
  const selectedPropertyIds: string[] = [];
  while (
    wordPropertyIds.length &&
    selectedPropertyIds.length < ADVANCED_MAX_PROPERTIES
  ) {
    const randomIndex = Math.floor(Math.random() * wordPropertyIds.length);
    selectedPropertyIds.push(wordPropertyIds[randomIndex]);
    wordPropertyIds.splice(randomIndex, 1);
  }

  const selectedProperties = selectedPropertyIds.map(
    (propId) =>
      allProperties.find(
        (prop) => prop.id === propId,
      ) as PropertyFieldsFragment,
  );

  return selectedProperties.sort((p1, p2) => p1.order - p2.order);
}
