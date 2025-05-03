import { NetworkStatus, useLazyQuery } from '@apollo/client';
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
  OptionPropertyValueFieldsFragment,
  PartOfSpeech,
  PropertyFieldsFragment,
  PropertyValueFieldsFragment,
  SavePropertyValueInput,
  TextPropertyValueFieldsFragment,
  WordFieldsFullFragment,
} from '../../../api/types/graphql';
import { toRecord } from '../../../utils/arrays';
import { toTimestamp } from '../../../utils/datetime';
import { useLanguageContext } from '../../LanguageContext';

export type Word = Omit<
  Partial<WordFieldsFullFragment>,
  'partOfSpeech' | 'properties'
> & {
  partOfSpeech: PartOfSpeech | null;
  properties: Record<string, PropertyValueFieldsFragment>;
};

type WordDetailsReturn = {
  isNewWord: boolean;
  word: Word;
  wordLoading: boolean;
  setOriginal: (original: string) => void;
  setTranslation: (translation: string) => void;
  setPartOfSpeech: (partOfSpeech: PartOfSpeech) => void;
  setPropertyValue: (propertyValue: SavePropertyValueInput) => void;

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
  const [original, setOriginal] = useState('');
  const [translation, setTranslation] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech | null>(null);
  const [propertyValueChanges, setPropertyValueChanges] = useState<
    Record<string, SavePropertyValueInput>
  >({});

  const [fetchWord, { data: wordQuery, networkStatus: fetchWordStatus }] =
    useLazyQuery(GetWordDocument, { notifyOnNetworkStatusChange: true });
  const [
    fetchProperties,
    { data: propertiesQuery, networkStatus: fetchPropertiesStatus },
  ] = useLazyQuery(GetPropertiesDocument, {
    notifyOnNetworkStatusChange: true,
  });
  const [createWordMutate, { data: createWordResult, loading: wordCreating }] =
    useCreateWord();
  const [updateWordMutate, { data: updateWordResult, loading: wordUpdating }] =
    useUpdateWord();
  const [deleteWordMutate, { data: deleteWordResult, loading: wordDeleting }] =
    useDeleteWord();

  const isNewWord = !wordId;
  const wordLoading = [
    NetworkStatus.loading,
    NetworkStatus.setVariables,
  ].includes(fetchWordStatus);
  const currentWord = !wordLoading ? wordQuery?.word : undefined;

  const propertiesLoading = [
    NetworkStatus.loading,
    NetworkStatus.setVariables,
  ].includes(fetchPropertiesStatus);
  const properties = !propertiesLoading
    ? propertiesQuery?.language?.properties
    : undefined;
  const createdWord = createWordResult?.createWord;
  const updatedWord = updateWordResult?.updateWord;
  const deletedWord = deleteWordResult?.deleteWord;

  const isWordValid = Boolean(
    original?.length && translation?.length && partOfSpeech,
  );

  const canCreateWord = Boolean(selectedLanguageId && isNewWord && isWordValid);
  const canUpdateWord = Boolean(
    selectedLanguageId &&
      !isNewWord &&
      isWordValid &&
      (original !== currentWord?.original ||
        translation !== currentWord?.translation ||
        Object.keys(propertyValueChanges).length),
  );
  const canDeleteWord = Boolean(selectedLanguageId && !isNewWord);

  const currentPropertyValues = useMemo<Word['properties']>(() => {
    return currentWord?.properties
      ? toRecord(currentWord.properties, (value) => value.property.id)
      : {};
  }, [currentWord]);

  const propertyValues = useMemo<Word['properties']>(() => {
    const propertyValues = { ...currentPropertyValues };
    for (const { id, text, option } of Object.values(propertyValueChanges)) {
      propertyValues[id] = {
        property: { id },
        ...(text !== undefined && { text }),
        ...(option !== undefined && { option }),
      } as PropertyValueFieldsFragment;
    }

    return propertyValues;
  }, [currentPropertyValues, propertyValueChanges]);

  useEffect(() => {
    if (wordId) {
      fetchWord({
        variables: { id: wordId },
      });
    }
  }, [wordId, fetchWord]);

  useEffect(() => {
    if (selectedLanguageId && partOfSpeech) {
      fetchProperties({
        variables: {
          languageId: selectedLanguageId,
          partOfSpeech,
        },
      });
    }
  }, [selectedLanguageId, partOfSpeech, fetchProperties]);

  useEffect(() => {
    setOriginal(currentWord?.original ?? '');
    setTranslation(currentWord?.translation ?? '');
    setPartOfSpeech(currentWord?.partOfSpeech ?? null);
    setPropertyValueChanges({});
  }, [currentWord]);

  const setPropertyValue = useCallback(
    ({ id, text, option }: SavePropertyValueInput) => {
      const updatedPropertyValueChanges = {
        ...propertyValueChanges,
        [id]: { id, text, option },
      };

      const currentValue = currentPropertyValues[id];
      if (text !== undefined) {
        const currentText =
          (currentValue as TextPropertyValueFieldsFragment)?.text ?? '';

        if (text === currentText) {
          delete updatedPropertyValueChanges[id];
        }
      } else if (option !== undefined) {
        const currentOption =
          (currentValue as OptionPropertyValueFieldsFragment)?.option ?? null;

        if (
          (!currentOption && !option) ||
          (currentOption?.id && currentOption.id === option?.id) ||
          (currentOption &&
            !currentOption.id &&
            currentOption.value === option?.value &&
            currentOption.color === (option.color ?? null))
        ) {
          delete updatedPropertyValueChanges[id];
        }
      }

      setPropertyValueChanges(updatedPropertyValueChanges);
    },
    [currentPropertyValues, propertyValueChanges],
  );

  const createWord = useCallback(async () => {
    if (canCreateWord) {
      setPropertyValueChanges({});
      await createWordMutate({
        variables: {
          input: {
            id: uuid(),
            original,
            translation,
            addedAt: toTimestamp(DateTime.utc()),
            languageId: selectedLanguageId!,
            partOfSpeech: partOfSpeech!,
            properties: Object.values(propertyValueChanges),
          },
        },
      });
    }
  }, [
    canCreateWord,
    createWordMutate,
    original,
    translation,
    selectedLanguageId,
    partOfSpeech,
    propertyValueChanges,
  ]);

  const updateWord = useCallback(async () => {
    if (canUpdateWord) {
      setPropertyValueChanges({});
      await updateWordMutate({
        variables: {
          input: {
            id: wordId!,
            ...(original !== currentWord?.original && { original }),
            ...(translation !== currentWord?.translation && { translation }),
            properties: Object.values(propertyValueChanges),
          },
        },
      });
    }
  }, [
    canUpdateWord,
    updateWordMutate,
    wordId,
    original,
    currentWord,
    translation,
    propertyValueChanges,
  ]);

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
      word: {
        ...currentWord,
        original,
        translation,
        partOfSpeech,
        properties: propertyValues,
      },
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
      currentWord,
      deleteWord,
      deletedWord,
      isNewWord,
      original,
      partOfSpeech,
      properties,
      propertiesLoading,
      propertyValues,
      setPropertyValue,
      translation,
      updateWord,
      updatedWord,
      wordCreating,
      wordDeleting,
      wordLoading,
      wordUpdating,
    ],
  );
}
