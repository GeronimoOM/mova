import { NetworkStatus, useLazyQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { v1 as uuid } from 'uuid';
import {
  buildCreateLinkRefetchQueries,
  buildDeleteLinkRefetchQueries,
  useCreateLink,
  useCreateWord,
  useDeleteLink,
  useDeleteWord,
  useUpdateWord,
} from '../../../api/mutations';
import {
  GetPropertiesDocument,
  GetWordDocument,
  LinkedWordFieldsFragment,
  OptionPropertyValueFieldsFragment,
  PartOfSpeech,
  PropertyFieldsFragment,
  PropertyValueFieldsFragment,
  SavePropertyValueInput,
  TextPropertyValueFieldsFragment,
  WordFieldsFullFragment,
  WordLinkType,
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
  similarLinks: LinkedWordChange[];
  distinctLinks: LinkedWordChange[];
};

type WordDetailsReturn = {
  isNewWord: boolean;
  word: Word;
  wordLoading: boolean;
  setOriginal: (original: string) => void;
  setTranslation: (translation: string) => void;
  setPartOfSpeech: (partOfSpeech: PartOfSpeech) => void;
  setPropertyValue: (propertyValue: SavePropertyValueInput) => void;
  addSimilar: (link: LinkedWordFieldsFragment) => void;
  deleteSimilar: (link: LinkedWordFieldsFragment) => void;
  addDistinct: (link: LinkedWordFieldsFragment) => void;
  deleteDistinct: (link: LinkedWordFieldsFragment) => void;

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

export type LinkedWordChange = LinkedWordFieldsFragment & {
  isDeleted?: boolean;
};

export function useWordDetails(wordId: string | null): WordDetailsReturn {
  const [selectedLanguageId] = useLanguageContext();
  const [original, setOriginal] = useState('');
  const [translation, setTranslation] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech | null>(null);
  const [propertyValueChanges, setPropertyValueChanges] = useState<
    Record<string, SavePropertyValueInput>
  >({});
  const [similarLinkChanges, setSimilarLinkChanges] = useState<
    Record<string, LinkedWordChange>
  >({});
  const [distinctLinkChanges, setDistinctLinkChanges] = useState<
    Record<string, LinkedWordChange>
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
  const [createLinkMutate, { loading: linkCreating }] = useCreateLink();
  const [deleteLinkMutate, { loading: linkDeleting }] = useDeleteLink();

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
        Object.keys(propertyValueChanges).length ||
        Object.keys(similarLinkChanges).length ||
        Object.keys(distinctLinkChanges).length),
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

  const combineLinkChanges = useCallback(
    (
      currentLinks: LinkedWordFieldsFragment[] | undefined,
      linkChanges: Record<string, LinkedWordChange>,
    ): LinkedWordChange[] => {
      return Object.values(linkChanges).reduce((current, linkChange) => {
        if (linkChange.isDeleted) {
          return current.map((link) =>
            link.id === linkChange.id ? linkChange : link,
          );
        } else {
          return [
            ...current.filter((link) => link.id !== linkChange.id),
            linkChange,
          ];
        }
      }, currentLinks ?? []);
    },
    [],
  );

  const similarLinks = useMemo<LinkedWordChange[]>(
    () => combineLinkChanges(currentWord?.similarLinks, similarLinkChanges),
    [combineLinkChanges, currentWord?.similarLinks, similarLinkChanges],
  );

  const distinctLinks = useMemo<LinkedWordChange[]>(
    () => combineLinkChanges(currentWord?.distinctLinks, distinctLinkChanges),
    [combineLinkChanges, currentWord?.distinctLinks, distinctLinkChanges],
  );

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
    setSimilarLinkChanges({});
    setDistinctLinkChanges({});
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

  const addLink = useCallback(
    (
      changes: Record<string, LinkedWordChange>,
      current: LinkedWordFieldsFragment[] | undefined,
      setter: Dispatch<SetStateAction<Record<string, LinkedWordChange>>>,
      link: LinkedWordChange,
    ) => {
      const updatedChanges = { ...changes };
      const currentLink = current?.find((l) => l.id === link.id);
      if (currentLink) {
        delete updatedChanges[link.id];
      } else {
        delete link.isDeleted;

        updatedChanges[link.id] = link;
      }

      setter(updatedChanges);
    },
    [],
  );
  const addSimilar = useCallback(
    (link: LinkedWordFieldsFragment) =>
      addLink(
        similarLinkChanges,
        currentWord?.similarLinks,
        setSimilarLinkChanges,
        link,
      ),
    [addLink, similarLinkChanges, currentWord?.similarLinks],
  );
  const addDistinct = useCallback(
    (link: LinkedWordFieldsFragment) =>
      addLink(
        distinctLinkChanges,
        currentWord?.distinctLinks,
        setDistinctLinkChanges,
        link,
      ),
    [addLink, distinctLinkChanges, currentWord?.distinctLinks],
  );

  const deleteLink = useCallback(
    (
      changes: Record<string, LinkedWordChange>,
      current: LinkedWordFieldsFragment[] | undefined,
      setter: Dispatch<SetStateAction<Record<string, LinkedWordChange>>>,
      link: LinkedWordFieldsFragment,
    ) => {
      const updatedChanges = { ...changes };
      const currentLink = current?.find((l) => l.id === link.id);
      if (currentLink) {
        updatedChanges[link.id] = {
          ...currentLink,
          isDeleted: true,
        };
      } else {
        delete updatedChanges[link.id];
      }

      setter(updatedChanges);
    },
    [],
  );
  const deleteSimilar = useCallback(
    (link: LinkedWordFieldsFragment) =>
      deleteLink(
        similarLinkChanges,
        currentWord?.similarLinks,
        setSimilarLinkChanges,
        link,
      ),
    [deleteLink, similarLinkChanges, currentWord?.similarLinks],
  );
  const deleteDistinct = useCallback(
    (link: LinkedWordFieldsFragment) =>
      deleteLink(
        distinctLinkChanges,
        currentWord?.distinctLinks,
        setDistinctLinkChanges,
        link,
      ),
    [deleteLink, distinctLinkChanges, currentWord?.distinctLinks],
  );

  const saveLinks = useCallback(
    async (wordId: string) => {
      const saveLinkRequests = [
        WordLinkType.Similar,
        WordLinkType.Distinct,
      ].flatMap((type) =>
        Object.values(
          type === WordLinkType.Similar
            ? similarLinkChanges
            : distinctLinkChanges,
        ).map((linkChange) =>
          (linkChange.isDeleted ? deleteLinkMutate : createLinkMutate)({
            ...(linkChange.isDeleted
              ? buildDeleteLinkRefetchQueries
              : buildCreateLinkRefetchQueries)(wordId, type, linkChange),
            variables: {
              input: {
                type,
                word1Id: wordId,
                word2Id: linkChange.id,
              },
            },
          }),
        ),
      );

      await Promise.all(saveLinkRequests);
    },
    [
      createLinkMutate,
      deleteLinkMutate,
      distinctLinkChanges,
      similarLinkChanges,
    ],
  );

  const createWord = useCallback(async () => {
    if (canCreateWord) {
      const createdWord = await createWordMutate({
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
      await saveLinks(createdWord.data!.createWord.id!);
    }
  }, [
    canCreateWord,
    createWordMutate,
    saveLinks,
    original,
    translation,
    selectedLanguageId,
    partOfSpeech,
    propertyValueChanges,
  ]);

  const updateWord = useCallback(async () => {
    if (canUpdateWord) {
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
      await saveLinks(wordId!);
    }
  }, [
    canUpdateWord,
    updateWordMutate,
    saveLinks,
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
        similarLinks,
        distinctLinks,
      },
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
      wordCreating: wordCreating || linkCreating || linkDeleting,
      createdWord,

      canUpdateWord,
      updateWord,
      wordUpdating: wordUpdating || linkCreating || linkDeleting,
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
      similarLinks,
      distinctLinks,
      addSimilar,
      deleteSimilar,
      addDistinct,
      deleteDistinct,
      linkCreating,
      linkDeleting,
      updateWord,
      updatedWord,
      wordCreating,
      wordDeleting,
      wordLoading,
      wordUpdating,
    ],
  );
}
