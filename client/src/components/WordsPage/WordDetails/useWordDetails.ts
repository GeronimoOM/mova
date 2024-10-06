import { useLazyQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v1 as uuid } from 'uuid';
import {
  useCreateWord,
  useDeleteWord,
  useUpdateWord,
} from '../../../api/mutations';
import {
  GetPropertiesDocument,
  GetWordDocument,
  PartOfSpeech,
  PropertyFieldsFragment,
  TextPropertyValue,
  UpdatePropertyValueInput,
  WordFieldsFullFragment,
} from '../../../api/types/graphql';
import { toRecord } from '../../../utils/arrays';
import { toTimestamp } from '../../../utils/datetime';
import { useLanguageContext } from '../../LanguageContext';

type WordDetails = Omit<Partial<WordFieldsFullFragment>, 'properties'> & {
  properties?: WordDetailsProperties;
};
type WordDetailsProperties = Record<string, UpdatePropertyValueInput>;

type WordDetailsReturn = {
  isNewWord: boolean;
  word: WordDetails;
  wordLoading: boolean;
  setOriginal: (original: string) => void;
  setTranslation: (translation: string) => void;
  setPartOfSpeech: (partOfSpeech: PartOfSpeech) => void;
  setPropertyValue: (propertyValue: UpdatePropertyValueInput) => void;

  properties?: Array<PropertyFieldsFragment>;
  propertiesLoading: boolean;

  canCreateWord: boolean;
  createWord: () => void;
  wordCreating: boolean;
  createdWord: WordFieldsFullFragment | undefined;

  canUpdateWord: boolean;
  updateWord: () => void;
  wordUpdating: boolean;
  updatedWord: WordFieldsFullFragment | undefined;

  wordDeleting: boolean;
  deleteWord: () => void;
  canDeleteWord: boolean;
  deletedWord: { id: string } | undefined;
};

export function useWordDetails(wordId: string | null): WordDetailsReturn {
  const [selectedLanguageId] = useLanguageContext();
  const [wordInput, setWordInput] = useState<WordDetails>({});
  const [fetchWord, { data: wordQuery, loading: wordLoading }] =
    useLazyQuery(GetWordDocument);
  const [
    fetchProperties,
    { data: propertiesQuery, loading: propertiesLoading },
  ] = useLazyQuery(GetPropertiesDocument);
  const [createWordMutate, { data: createWordResult, loading: wordCreating }] =
    useCreateWord();
  const [updateWordMutate, { data: updateWordResult, loading: wordUpdating }] =
    useUpdateWord();
  const [deleteWordMutate, { data: deleteWordResult, loading: wordDeleting }] =
    useDeleteWord();

  const isNewWord = !wordId;
  const currentWord =
    wordQuery?.word?.id === wordId ? wordQuery.word : undefined;
  const currentWordProperties = useMemo(
    () => toWordDetailsProperties(currentWord ?? undefined),
    [currentWord],
  );
  const properties = !propertiesLoading
    ? propertiesQuery?.language?.properties
    : undefined;
  const createdWord = createWordResult?.createWord;
  const updatedWord = updateWordResult?.updateWord;
  const deletedWord = deleteWordResult?.deleteWord;

  const canCreateWord = Boolean(
    selectedLanguageId &&
      isNewWord &&
      wordInput.original?.length &&
      wordInput.translation?.length &&
      wordInput.partOfSpeech,
  );
  const canUpdateWord = Boolean(
    selectedLanguageId &&
      !isNewWord &&
      ((wordInput.original && wordInput.original !== currentWord?.original) ||
        (wordInput.translation &&
          wordInput.translation !== currentWord?.translation) ||
        Object.values(wordInput.properties ?? {}).some(
          (prop) => (currentWordProperties[prop.id]?.text ?? '') !== prop.text,
        )),
  );
  const canDeleteWord = Boolean(selectedLanguageId && !isNewWord);

  const word = useMemo<WordDetails>(
    () => ({
      original: wordInput?.original ?? currentWord?.original ?? '',
      translation: wordInput?.translation ?? currentWord?.translation ?? '',
      partOfSpeech: wordInput?.partOfSpeech ?? currentWord?.partOfSpeech,
      properties: { ...currentWordProperties, ...wordInput.properties },
      mastery: currentWord?.mastery,
      nextExerciseAt: currentWord?.nextExerciseAt,
    }),
    [currentWord, currentWordProperties, wordInput],
  );

  useEffect(() => {
    setWordInput({});
  }, [selectedLanguageId]);

  useEffect(() => {
    if (wordId) {
      fetchWord({
        variables: { id: wordId },
      });
    }
  }, [wordId, fetchWord]);

  useEffect(() => {
    if (selectedLanguageId && word.partOfSpeech) {
      fetchProperties({
        variables: {
          languageId: selectedLanguageId,
          partOfSpeech: word.partOfSpeech,
        },
      });
    }
  }, [selectedLanguageId, word.partOfSpeech, fetchProperties]);

  const setOriginal = useCallback((original: string) => {
    setWordInput((prev) => ({ ...prev, original: original }));
  }, []);

  const setTranslation = useCallback((translation: string) => {
    setWordInput((prev) => ({ ...prev, translation: translation }));
  }, []);

  const setPartOfSpeech = useCallback((partOfSpeech: PartOfSpeech) => {
    setWordInput((prev) => ({ ...prev, partOfSpeech }));
  }, []);

  const setPropertyValue = useCallback(
    (propertyValue: UpdatePropertyValueInput) => {
      setWordInput((prev) => ({
        ...prev,
        properties: {
          ...prev.properties,
          [propertyValue.id]: propertyValue,
        },
      }));
    },
    [],
  );

  const createWord = useCallback(async () => {
    if (canCreateWord) {
      await createWordMutate({
        variables: {
          input: {
            id: uuid(),
            original: wordInput.original!.trim(),
            translation: wordInput.translation!.trim(),
            addedAt: toTimestamp(DateTime.utc()),
            languageId: selectedLanguageId!,
            partOfSpeech: wordInput.partOfSpeech!,
            properties: Object.values(wordInput.properties ?? {}).map(
              (prop) => ({
                ...prop,
                ...(prop.text && { text: prop.text.trim() }),
              }),
            ),
          },
        },
      });

      setWordInput({});
    }
  }, [canCreateWord, selectedLanguageId, wordInput, createWordMutate]);

  const updateWord = useCallback(async () => {
    if (canUpdateWord) {
      await updateWordMutate({
        variables: {
          input: {
            id: wordId!,
            ...(wordInput.original && { original: wordInput.original.trim() }),
            ...(wordInput.translation && {
              translation: wordInput.translation.trim(),
            }),
            ...(wordInput.properties &&
              Object.values(wordInput.properties).length && {
                properties: Object.values(wordInput.properties).map((prop) => ({
                  ...prop,
                  ...(prop.text && { text: prop.text.trim() }),
                })),
              }),
          },
        },
      });

      setWordInput({});
    }
  }, [canUpdateWord, wordId, wordInput, updateWordMutate]);

  const deleteWord = useCallback(() => {
    if (canDeleteWord) {
      deleteWordMutate({
        variables: { input: { id: wordId! } },
      });
    }
  }, [canDeleteWord, wordId, deleteWordMutate]);

  return useMemo<WordDetailsReturn>(
    () => ({
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
      updatedWord,

      wordDeleting,
      deleteWord,
      canDeleteWord,
      deletedWord,
    }),
    [
      canCreateWord,
      canDeleteWord,
      canUpdateWord,
      createWord,
      createdWord,
      deleteWord,
      deletedWord,
      isNewWord,
      properties,
      propertiesLoading,
      setOriginal,
      setPartOfSpeech,
      setPropertyValue,
      setTranslation,
      updateWord,
      updatedWord,
      word,
      wordCreating,
      wordDeleting,
      wordLoading,
      wordUpdating,
    ],
  );
}

function toWordDetailsProperties(
  word?: WordFieldsFullFragment,
): WordDetailsProperties {
  return toRecord(
    (word?.properties ?? []).map((propValue) => ({
      id: propValue.property.id,
      text: (propValue as TextPropertyValue).text,
    })),
    (prop) => prop.id,
  );
}
