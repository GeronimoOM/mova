import React, { useEffect } from 'react';
import { FaFeatherPointed } from 'react-icons/fa6';

import { BsTranslate } from 'react-icons/bs';
import { FaFire } from 'react-icons/fa6';
import { HiMiniXMark } from 'react-icons/hi2';

import { ButtonIcon } from '../../common/ButtonIcon';
import { Icon } from '../../common/Icon';
import { Input } from '../../common/Input';
import { WordProgress } from '../WordsList/WordProgress';
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
};

export const WordDetails: React.FC<WordDetailsProps> = ({
  wordId,
  onSelectWord,
  onClose,
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
        <div className={styles.buttons}>
          <ButtonIcon icon={HiMiniXMark} onClick={onClose} />
          <ButtonIcon
            icon={FaFeatherPointed}
            onClick={isNewWord ? createWord : updateWord}
            type="primary"
            disabled={!canCreateWord && !canUpdateWord}
            loading={isNewWord ? wordCreating : wordUpdating}
          />
          <ButtonIcon
            icon={FaFire}
            onClick={deleteWord}
            type="secondary"
            disabled={!canDeleteWord}
            loading={wordDeleting}
          />
        </div>

        <div className={styles.details}>
          <div className={styles.detailsHeader}>
            <PartOfSpeechSelect
              partOfSpeech={word.partOfSpeech ?? null}
              onPartOfSpeechSelect={setPartOfSpeech}
              disabled={!isNewWord}
            />
            <WordProgress progress={2} />
          </div>

          <Input
            text="original"
            size="large"
            value={word?.original ?? ''}
            onChange={setOriginal}
            loading={wordLoading}
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
          />
          {!propertiesLoading ? (
            properties?.map((property) => (
              <WordDetailsProperty
                key={property.id}
                property={property}
                wordProperty={word.properties?.[property.id] ?? null}
                onChange={setPropertyValue}
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
