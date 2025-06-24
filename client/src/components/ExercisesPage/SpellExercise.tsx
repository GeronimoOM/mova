import { useEffect, useMemo, useState } from 'react';
import { FaAngleDoubleRight } from 'react-icons/fa';

import {
  BsFillExclamationDiamondFill,
  BsFillLightbulbFill,
} from 'react-icons/bs';
import { FaCheck, FaMinus } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa6';

import {
  LinkedWordFieldsFragment,
  OptionPropertyFieldsFragment,
  OptionPropertyValueFieldsFragment,
  OptionValue,
  PropertyFieldsFragment,
  PropertyType,
  TextPropertyFieldsFragment,
  TextPropertyValueFieldsFragment,
} from '../../api/types/graphql';
import { Input } from '../common/Input';
import { SpellInput } from '../common/SpellInput';

import { useTranslation } from 'react-i18next';
import { AccentColor } from '../../index.css';
import * as arrays from '../../utils/arrays';
import { pickN } from '../../utils/random';
import { ButtonIcon } from '../common/ButtonIcon';
import { Icon } from '../common/Icon';
import { WordDetailsOptionProperty } from '../WordsPage/WordDetails/WordDetailsProperty';
import { ExerciseWord } from './exercises';
import * as styles from './SpellExercise.css';

const NORMAL_REVEAL_PREFIX = 1;
const ADVANCED_REVEAL_PREFIX = 0;
const EXTRA_CHARACTERS_CHAR = '_';
const ADVANCED_MAX_TEXT_PROPERTIES = 2;
const ADVANCED_MAX_OPTION_PROPERTIES = 1;

export type SpellExerciseProps = {
  word: ExerciseWord;
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
  const [similar, setSimilar] = useState<LinkedWordFieldsFragment | null>(null);
  const [attempt, setAttempt] = useState(1);
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
    setSimilar(null);
  };

  const handleSimilar = (similar: LinkedWordFieldsFragment) => {
    setSubmitted(false);
    setAttempt((attempt) => attempt + 1);
    setSimilar(similar);
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

      {similar && <SpellExerciseSimilarMessage similar={similar} />}

      <SpellTextExerciseProperty
        key={attempt}
        word={word}
        property={null}
        isSubmitted={isSubmitted}
        revealPrefix={revealPrefix}
        advanced={advanced}
        onResult={(result) => handlePartialResult('original', result)}
        onSimilar={handleSimilar}
      />

      {wordProperties.map((property) =>
        property.type === PropertyType.Text ? (
          <SpellTextExerciseProperty
            key={`${attempt}:${property.id}`}
            word={word}
            property={property as TextPropertyFieldsFragment}
            isSubmitted={isSubmitted}
            revealPrefix={revealPrefix}
            advanced={advanced}
            onResult={(result) => handlePartialResult(property.id, result)}
          />
        ) : (
          <SpellOptionExerciseProperty
            key={`${attempt}:${property.id}`}
            word={word}
            property={property as OptionPropertyFieldsFragment}
            isSubmitted={isSubmitted}
            onResult={(result) => handlePartialResult(property.id, result)}
          />
        ),
      )}

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
  word: ExerciseWord;
  property: TextPropertyFieldsFragment | null;
  isSubmitted: boolean;
  revealPrefix: number;
  advanced?: boolean;
  onResult: (result: boolean) => void;
  onSimilar?: (link: LinkedWordFieldsFragment) => void;
};

const SpellTextExerciseProperty = ({
  word,
  property,
  isSubmitted,
  revealPrefix,
  advanced,
  onResult,
  onSimilar,
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

  const revealPrefixInput = useMemo(
    () => propertyValue.slice(0, revealPrefix),
    [propertyValue, revealPrefix],
  );

  const [input, setInput] = useState(revealPrefixInput);
  const [isVerified, setIsVerified] = useState(false);
  const [highlights, setHighlights] = useState<Array<AccentColor | null>>(
    Array(revealPrefix).fill('primary'),
  );

  const { t } = useTranslation();

  useEffect(() => {
    setInput((input) => revealPrefixInput + input.slice(revealPrefix));
    setHighlights(Array(revealPrefix).fill('primary'));
  }, [revealPrefixInput, revealPrefix]);

  useEffect(() => {
    if (isSubmitted && !isVerified) {
      if (onSimilar && !property) {
        const similarLink = word.similarLinks.find(
          (link) => link.original === input.trim(),
        );
        if (similarLink) {
          return onSimilar(similarLink);
        }
      }

      onResult(input.trim() === propertyValue);

      let verifiedInput = propertyValue;
      const verifiedHighlights = propertyValue
        .split('')
        .map((char, i) => (char === input[i] ? 'primary' : 'negative'));
      if (
        input.trim().length > propertyValue.length &&
        input.slice(0, propertyValue.length) === propertyValue
      ) {
        verifiedInput += EXTRA_CHARACTERS_CHAR;
        verifiedHighlights.push('negative');
      }

      setInput(verifiedInput);
      setHighlights(verifiedHighlights);

      setIsVerified(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, isSubmitted, propertyValue]);

  const handleInput = (value: string) => {
    if (value.startsWith(revealPrefixInput)) {
      setInput(value);
    }
  };

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

type SpellOptionExercisePropertyProps = {
  word: ExerciseWord;
  property: OptionPropertyFieldsFragment;
  isSubmitted: boolean;
  onResult: (result: boolean) => void;
};

const SpellOptionExerciseProperty = ({
  word,
  property,
  isSubmitted,
  onResult,
}: SpellOptionExercisePropertyProps) => {
  const propertyValue = useMemo(() => {
    const wordProperty = word.properties.find(
      (prop) => prop.property.id === property.id,
    ) as OptionPropertyValueFieldsFragment;
    return wordProperty.option!;
  }, [word, property]);

  const [inputOption, setInputOption] = useState<OptionValue | null>(null);

  const inputPropertyValue = useMemo<OptionPropertyValueFieldsFragment>(
    () => ({
      property,
      option: inputOption as OptionValue,
    }),
    [inputOption, property],
  );

  const [isVerified, setIsVerified] = useState(false);
  const [result, setResult] = useState(false);

  useEffect(() => {
    if (isSubmitted && !isVerified) {
      const result = inputOption?.value === propertyValue?.value;
      onResult(result);
      setResult(result);
      setInputOption(propertyValue);
      setIsVerified(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, isSubmitted, propertyValue]);

  return (
    <div className={styles.property}>
      <div className={styles.propertyLabel}>{property.name}</div>

      <div className={styles.optionPropertyRow}>
        <div className={styles.optionPropertyPill}>
          <WordDetailsOptionProperty
            property={property}
            propertyValue={inputPropertyValue}
            onChange={({ option }) =>
              setInputOption(
                option?.value ? { id: option.id, value: option.value } : null,
              )
            }
            disabled={isSubmitted}
            exercise
          />
        </div>

        {isVerified && (
          <div className={styles.optionPropertyResult}>
            <Icon
              icon={result ? FaCheck : FaMinus}
              color={result ? 'primary' : 'negative'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

type SpellExerciseSimilarMessageProps = {
  similar: LinkedWordFieldsFragment;
};

const SpellExerciseSimilarMessage = ({
  similar,
}: SpellExerciseSimilarMessageProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.similarMessage}>
      <Icon icon={BsFillExclamationDiamondFill} size="medium" color="primary" />
      <div className={styles.similarMessageWord}>{similar.original}</div>
      <div className={styles.similarMessageText}>
        {t('exercise.spellSimilar')}
      </div>
    </div>
  );
};

function getExerciseProperties(
  word: ExerciseWord,
  allProperties: PropertyFieldsFragment[],
): PropertyFieldsFragment[] {
  const [wordTextProperties, wordOptionProperties] = arrays.splitByPredicate(
    word.properties,
    (prop) => prop.__typename === 'TextPropertyValue',
  );
  const selectedPropertyIds = [
    ...pickN(
      wordTextProperties.map((prop) => prop.property.id),
      ADVANCED_MAX_TEXT_PROPERTIES,
    ),

    ...pickN(
      wordOptionProperties.map((prop) => prop.property.id),
      ADVANCED_MAX_OPTION_PROPERTIES,
    ),
  ];

  const selectedProperties = selectedPropertyIds.map(
    (propId) => allProperties.find((prop) => prop.id === propId)!,
  );

  return selectedProperties.sort((p1, p2) => p1.order - p2.order);
}
