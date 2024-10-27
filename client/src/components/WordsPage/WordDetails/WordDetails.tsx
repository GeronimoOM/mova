import React, { useEffect } from 'react';
import { FaFeatherPointed, FaFire } from 'react-icons/fa6';

import { BsFillExclamationDiamondFill, BsTranslate } from 'react-icons/bs';
import { HiMiniXMark } from 'react-icons/hi2';

import { NetworkStatus, useLazyQuery } from '@apollo/client';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  GetWordByOriginalDocument,
  WordFieldsFragment,
} from '../../../api/types/graphql';
import { useDebouncedValue } from '../../../utils/useDebouncedValue';
import { useLanguageContext } from '../../LanguageContext';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Icon } from '../../common/Icon';
import { Input } from '../../common/Input';
import { Tooltip } from '../../common/Tooltip';
import { WordMastery } from '../WordsList/WordMastery';
import { PartOfSpeechSelect } from './PartOfSpeechSelect';
import * as styles from './WordDetails.css';
import {
  WordDetailsPropertiesSkeleton,
  WordDetailsProperty,
} from './WordDetailsProperty';
import { useWordDetails } from './useWordDetails';

export type WordDetailsProps = {
  wordId: string | null;
  onSelectWord: (wordId: string | null) => void;
  onClose: () => void;
  simplified?: boolean;
};

const EXISTS_DELAY_MS = 300;

export const WordDetails: React.FC<WordDetailsProps> = ({
  wordId,
  onSelectWord,
  onClose,
  simplified,
}) => {
  const [selectedLanguageId] = useLanguageContext();

  const {
    isNewWord,
    word,
    wordLoading,
    setOriginal,
    setTranslation,
    setPartOfSpeech,
    setPropertyValue,
    properties,
    propertiesLoading,
    canCreateWord,
    createWord,
    wordCreating,
    createdWord,
    canUpdateWord,
    updateWord,
    wordUpdating,
    wordDeleting,
    deleteWord,
    canDeleteWord,
    deletedWord,
  } = useWordDetails(wordId);

  const [
    fetchExistingWord,
    { data: existingWordQuery, networkStatus: existingWordStatus },
  ] = useLazyQuery(GetWordByOriginalDocument, {
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  });
  const existingWordLoading = [
    NetworkStatus.loading,
    NetworkStatus.setVariables,
  ].includes(existingWordStatus);

  const { t } = useTranslation();
  const debouncedOriginal = useDebouncedValue(word?.original, EXISTS_DELAY_MS);
  const existingWord =
    isNewWord && debouncedOriginal && !existingWordLoading
      ? existingWordQuery?.language?.word
      : undefined;

  useEffect(() => {
    if (selectedLanguageId && isNewWord && debouncedOriginal) {
      fetchExistingWord({
        variables: {
          languageId: selectedLanguageId,
          original: debouncedOriginal,
        },
      });
    }
  }, [selectedLanguageId, isNewWord, debouncedOriginal, fetchExistingWord]);

  useEffect(() => {
    if (createdWord?.id) {
      onSelectWord(null);
      onClose();
    }
  }, [createdWord, onClose, onSelectWord]);

  useEffect(() => {
    if (deletedWord) {
      onSelectWord(null);
      onClose();
    }
  }, [deletedWord, onClose, onSelectWord]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.innerWrapper}>
        {!simplified && (
          <div className={styles.buttons}>
            <ButtonIcon icon={HiMiniXMark} onClick={onClose} wrapped={true} />

            <ButtonIcon
              icon={FaFeatherPointed}
              onClick={isNewWord ? createWord : updateWord}
              color="primary"
              highlighted={true}
              disabled={!canCreateWord && !canUpdateWord}
              loading={isNewWord ? wordCreating : wordUpdating}
              wrapped={true}
            />

            <div className={styles.bottomButton}>
              <ButtonIcon
                icon={FaFire}
                onClick={deleteWord}
                color="negative"
                disabled={!canDeleteWord}
                loading={wordDeleting}
                wrapped={true}
              />
            </div>
          </div>
        )}

        <div className={styles.details}>
          <div className={classNames(styles.detailsHeader, { simplified })}>
            <PartOfSpeechSelect
              partOfSpeech={word.partOfSpeech ?? null}
              onPartOfSpeechSelect={setPartOfSpeech}
              disabled={!isNewWord}
            />
            <WordMastery
              mastery={word.mastery ?? 0}
              nextExerciseAt={word.nextExerciseAt ?? null}
            />
          </div>

          <div className={classNames(styles.originalRow, { simplified })}>
            <Input
              text="original"
              value={word?.original ?? ''}
              onChange={setOriginal}
              loading={wordLoading}
              disabled={simplified}
              right={
                existingWord && (
                  <ExistingWordWarningIcon
                    word={existingWord}
                    onSelectWord={() => onSelectWord(existingWord.id)}
                  />
                )
              }
            />
          </div>

          <div className={styles.detailsRow}>
            <div className={styles.translationLabel}>
              {t('words.translation')}
            </div>
            <div className={styles.translationRow}>
              <div className={styles.translationIcon}>
                <Icon icon={BsTranslate} />
              </div>

              <Input
                text="translation"
                size="medium"
                value={word?.translation ?? ''}
                onChange={setTranslation}
                loading={wordLoading}
                disabled={simplified}
              />
            </div>
          </div>

          {!propertiesLoading ? (
            properties?.map((property) => (
              <WordDetailsProperty
                key={property.id}
                property={property}
                wordProperty={word.properties?.[property.id] ?? null}
                onChange={setPropertyValue}
                simplified={simplified}
              />
            ))
          ) : (
            <WordDetailsPropertiesSkeleton />
          )}

          {!simplified && <div className={styles.detailsEnd} />}
        </div>
      </div>
    </div>
  );
};

type ExistingWarningProps = {
  word: WordFieldsFragment;
  onSelectWord: () => void;
};

const ExistingWordWarningIcon: React.FC<ExistingWarningProps> = ({
  word,
  onSelectWord,
}) => {
  return (
    <Tooltip
      content={
        <ExistingWordWarningTooltip word={word} onSelectWord={onSelectWord} />
      }
      side="bottomLeft"
    >
      <div className={styles.existingWarningIcon}>
        <Icon icon={BsFillExclamationDiamondFill} />
      </div>
    </Tooltip>
  );
};

const ExistingWordWarningTooltip: React.FC<ExistingWarningProps> = ({
  word,
  onSelectWord,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.existingWarningTooltip}>
      <div className={styles.existingWarningWord} onClick={onSelectWord}>
        {word.original}
      </div>
      {t('words.existing')}
    </div>
  );
};
