import React, { useEffect } from 'react';
import { FaFeatherPointed, FaFire } from 'react-icons/fa6';

import { BsTranslate } from 'react-icons/bs';
import { HiMiniXMark } from 'react-icons/hi2';

import { ButtonIcon } from '../../common/ButtonIcon';
import { Icon } from '../../common/Icon';
import { Input } from '../../common/Input';
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

export const WordDetails: React.FC<WordDetailsProps> = ({
  wordId,
  onSelectWord,
  onClose,
  simplified,
}) => {
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

  useEffect(() => {
    if (createdWord?.id) {
      onSelectWord(createdWord?.id);
    }
  }, [createdWord?.id, onSelectWord]);

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
            <ButtonIcon icon={HiMiniXMark} onClick={onClose} />
            <ButtonIcon
              icon={FaFeatherPointed}
              onClick={isNewWord ? createWord : updateWord}
              color="primary"
              highlighted={true}
              disabled={!canCreateWord && !canUpdateWord}
              loading={isNewWord ? wordCreating : wordUpdating}
            />

            <div className={styles.bottomButton}>
              <ButtonIcon
                icon={FaFire}
                onClick={deleteWord}
                color="negative"
                disabled={!canDeleteWord}
                loading={wordDeleting}
              />
            </div>
          </div>
        )}

        <div className={styles.details({ simplified })}>
          <div className={styles.detailsHeader}>
            <PartOfSpeechSelect
              partOfSpeech={word.partOfSpeech ?? null}
              onPartOfSpeechSelect={setPartOfSpeech}
              disabled={!isNewWord}
            />
            <WordMastery mastery={word.mastery ?? 0} />
          </div>

          <Input
            text="original"
            size="large"
            value={word?.original ?? ''}
            onChange={setOriginal}
            loading={wordLoading}
            disabled={simplified}
          />

          <div className={styles.translationLabel}>
            <Icon icon={BsTranslate} size="small" />
            {'translation'}
          </div>

          <Input
            text="translation"
            size="medium"
            value={word?.translation ?? ''}
            onChange={setTranslation}
            loading={wordLoading}
            disabled={simplified}
          />
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
        </div>
      </div>
    </div>
  );
};
