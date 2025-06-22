import { useEffect, useState } from 'react';
import { BsFillExclamationDiamondFill, BsTranslate } from 'react-icons/bs';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { FaFeatherPointed, FaFire } from 'react-icons/fa6';
import { HiMiniXMark } from 'react-icons/hi2';
import { MdMoreVert } from 'react-icons/md';

import { NetworkStatus, useLazyQuery } from '@apollo/client';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  GetWordByOriginalDocument,
  WordFieldsFragment,
  WordLinkType,
} from '../../../api/types/graphql';
import { hover } from '../../../index.css';
import { useDebouncedValue } from '../../../utils/useDebouncedValue';
import { useMediaQuery } from '../../../utils/useMediaQuery';
import { useLanguageContext } from '../../LanguageContext';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Dropdown } from '../../common/Dropdown';
import { Icon } from '../../common/Icon';
import { Input } from '../../common/Input';
import { Modal } from '../../common/Modal';
import { WordMastery } from '../WordsList/WordMastery';
import { PartOfSpeechSelect } from './PartOfSpeechSelect';
import * as styles from './WordDetails.css';
import {
  WordDetailsPropertiesSkeleton,
  WordDetailsProperty,
} from './WordDetailsProperty';
import { WordLinks } from './WordLinks';
import { useWordDetails } from './useWordDetails';

export type WordDetailsProps = {
  wordId: string | null;
  onSelectWord: (wordId: string | null) => void;
  onClose: () => void;
  hasPrev?: boolean;
  onSelectPrev?: () => void;
  hasNext?: boolean;
  onSelectNext?: () => void;
  disabled?: boolean;
};

const EXISTS_DELAY_MS = 300;

export const WordDetails = ({
  wordId,
  onSelectWord,
  onClose,
  hasPrev,
  onSelectPrev,
  hasNext,
  onSelectNext,
  disabled,
}: WordDetailsProps) => {
  const [selectedLanguageId] = useLanguageContext();

  const {
    isNewWord,
    word,
    wordLoading,
    setOriginal,
    setTranslation,
    setPartOfSpeech,
    setPropertyValue,
    addSimilar,
    deleteSimilar,
    addDistinct,
    deleteDistinct,
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
  const debouncedOriginal = useDebouncedValue(word.original, EXISTS_DELAY_MS);
  const existingWord =
    isNewWord && debouncedOriginal && !existingWordLoading
      ? existingWordQuery?.language?.word
      : undefined;

  const [areMoreButtonsVisible, setMoreButtonsVisible] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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
        {!disabled && (
          <>
            <div className={styles.buttonsTop}>
              <ButtonIcon
                icon={HiMiniXMark}
                onClick={onClose}
                wrapped={true}
                dataTestId="word-details-close-btn"
              />

              <ButtonIcon
                icon={FaFeatherPointed}
                onClick={isNewWord ? createWord : updateWord}
                color="primary"
                highlighted={true}
                disabled={!canCreateWord && !canUpdateWord}
                loading={isNewWord ? wordCreating : wordUpdating}
                wrapped={true}
                dataTestId="word-details-save-btn"
              />
            </div>

            <div className={styles.buttonsBottom}>
              {!disabled && areMoreButtonsVisible && (
                <ButtonIcon
                  icon={FaArrowUp}
                  onClick={onSelectPrev}
                  disabled={!hasPrev}
                  wrapped={true}
                  dataTestId="word-details-up-btn"
                />
              )}

              {!disabled && areMoreButtonsVisible && (
                <ButtonIcon
                  icon={FaArrowDown}
                  onClick={onSelectNext}
                  disabled={!hasNext}
                  wrapped={true}
                  dataTestId="word-details-down-btn"
                />
              )}

              {areMoreButtonsVisible && (
                <ButtonIcon
                  icon={FaFire}
                  onClick={() => setDeleteConfirmOpen(true)}
                  color="negative"
                  disabled={!canDeleteWord}
                  wrapped={true}
                  dataTestId="word-details-delete-btn"
                />
              )}

              <ButtonIcon
                onClick={() => setMoreButtonsVisible(!areMoreButtonsVisible)}
                icon={MdMoreVert}
                toggled={areMoreButtonsVisible}
                wrapped={true}
                dataTestId="word-details-more-btn"
              />
            </div>
          </>
        )}

        <div className={styles.details}>
          <div className={classNames(styles.detailsHeader, { disabled })}>
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

          <div className={classNames(styles.originalRow, { disabled })}>
            <Input
              text="original"
              value={word.original ?? ''}
              onChange={setOriginal}
              loading={wordLoading}
              disabled={disabled}
              maxLength={100}
              right={
                existingWord && (
                  <ExistingWordWarningIcon
                    word={existingWord}
                    onSelectWord={() => onSelectWord(existingWord.id)}
                  />
                )
              }
              dataTestId="word-details-original"
            />
          </div>

          <div className={styles.detailsRow}>
            <div className={styles.translationLabel}>
              {t('words.translation')}
            </div>
            <div className={styles.translationRow}>
              <div className={styles.icon}>
                <Icon icon={BsTranslate} />
              </div>

              <Input
                text="translation"
                size="medium"
                value={word.translation ?? ''}
                onChange={setTranslation}
                loading={wordLoading}
                disabled={disabled}
                maxLength={100}
                dataTestId="word-details-translation"
              />
            </div>
          </div>

          {!propertiesLoading ? (
            properties?.map((property) => (
              <WordDetailsProperty
                key={property.id}
                property={property}
                propertyValue={word.properties?.[property.id] ?? null}
                onChange={setPropertyValue}
                disabled={disabled}
              />
            ))
          ) : (
            <WordDetailsPropertiesSkeleton />
          )}

          <div className={styles.detailsRowGap} />

          <div className={styles.detailsRow}>
            <WordLinks
              word={word}
              type={WordLinkType.Similar}
              links={word.similarLinks}
              onOpenLink={onSelectWord}
              onAddLink={addSimilar}
              onDeleteLink={deleteSimilar}
            />
          </div>

          <div className={styles.detailsRow}>
            <WordLinks
              word={word}
              type={WordLinkType.Distinct}
              links={word.distinctLinks}
              onOpenLink={onSelectWord}
              onAddLink={addDistinct}
              onDeleteLink={deleteDistinct}
            />
          </div>

          {!disabled && <div className={styles.detailsEnd} />}
        </div>
      </div>

      {isDeleteConfirmOpen && (
        <Modal onClose={() => setDeleteConfirmOpen(false)}>
          <div className={styles.deleteConfirm}>
            <div className={styles.deleteConfirmText}>
              {t('words.delete')}
              <div className={styles.deleteConfirmWord}>{word.original}</div>
            </div>

            <div className={styles.deleteConfirmButtons}>
              <ButtonIcon
                icon={FaFire}
                onClick={deleteWord}
                color="negative"
                loading={wordDeleting}
                dataTestId="word-details-delete-confirm-btn"
              />

              <ButtonIcon
                icon={HiMiniXMark}
                onClick={() => setDeleteConfirmOpen(false)}
                dataTestId="word-details-delete-cancel-btn"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

type ExistingWarningProps = {
  word: WordFieldsFragment;
  onSelectWord: () => void;
};

const ExistingWordWarningIcon = ({
  word,
  onSelectWord,
}: ExistingWarningProps) => {
  const [isOpen, setOpen] = useState(false);
  const canHover = useMediaQuery(hover.enabled);

  return (
    <Dropdown
      isOpen={isOpen}
      onOpen={setOpen}
      content={
        <ExistingWordWarningTooltip word={word} onSelectWord={onSelectWord} />
      }
      alignment="end"
    >
      <div
        className={styles.existingWarningIcon}
        onClick={(e) => canHover && e.stopPropagation()}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <Icon icon={BsFillExclamationDiamondFill} />
      </div>
    </Dropdown>
  );
};

const ExistingWordWarningTooltip = ({
  word,
  onSelectWord,
}: ExistingWarningProps) => {
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
