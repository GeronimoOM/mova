import { DateTime } from 'luxon';
import { useCallback, useMemo, useState } from 'react';
import { v1 as uuid } from 'uuid';
import {
  useCreateLanguage,
  useDeleteLanguage,
  useUpdateLanguage,
} from '../../api/mutations';
import { LanguageFieldsFragment } from '../../api/types/graphql';
import { toTimestamp } from '../../utils/datetime';
import { useLanguageContext } from '../LanguageContext';

const MIN_LANGUAGE_NAME_LENGTH = 3;

export type LanguageReturn = {
  isNewLanguage: boolean;
  language: Partial<LanguageFieldsFragment>;
  setName: (name: string) => void;

  canCreateLanguage: boolean;
  createLanguage: () => void;
  languageCreating: boolean;
  createdLanguage: LanguageFieldsFragment | undefined;

  canUpdateLanguage: boolean;
  updateLanguage: () => void;
  languageUpdating: boolean;
  updatedLanguage: { id: string; name: string } | undefined;

  languageDeleting: boolean;
  deleteLanguage: () => void;
  canDeleteLanguage: boolean;
  deletedLanguage: { id: string } | undefined;
};

export function useLanguage(
  language: LanguageFieldsFragment | null,
): LanguageReturn {
  const [selectedLanguageId] = useLanguageContext();
  const [nameInput, setNameInput] = useState(language?.name ?? '');

  const [
    createLanguageMutate,
    { data: createLanguageResult, loading: languageCreating },
  ] = useCreateLanguage();
  const [
    updateLanguageMutate,
    { data: updateLanguageResult, loading: languageUpdating },
  ] = useUpdateLanguage();
  const [
    deleteLanguageMutate,
    { data: deleteLanguageResult, loading: languageDeleting },
  ] = useDeleteLanguage();

  const isNewLanguage = !language;
  const createdLanguage = createLanguageResult?.createLanguage;
  const updatedLanguage = updateLanguageResult?.updateLanguage;
  const deletedLanguage = deleteLanguageResult?.deleteLanguage;

  const canCreateLanguage = Boolean(
    selectedLanguageId &&
      isNewLanguage &&
      nameInput.length >= MIN_LANGUAGE_NAME_LENGTH,
  );
  const canUpdateLanguage = Boolean(
    selectedLanguageId &&
      !isNewLanguage &&
      nameInput.length >= MIN_LANGUAGE_NAME_LENGTH &&
      nameInput !== language.name,
  );
  const canDeleteLanguage = Boolean(selectedLanguageId && !isNewLanguage);

  const createLanguage = useCallback(() => {
    if (canCreateLanguage) {
      createLanguageMutate({
        variables: {
          input: {
            id: uuid(),
            name: nameInput,
            addedAt: toTimestamp(DateTime.utc()),
          },
        },
      });
    }
  }, [nameInput, canCreateLanguage, createLanguageMutate]);

  const updateLanguage = useCallback(() => {
    if (canUpdateLanguage) {
      updateLanguageMutate({
        variables: {
          input: {
            id: language!.id,
            name: nameInput,
          },
        },
      });
    }
  }, [language, nameInput, canUpdateLanguage, updateLanguageMutate]);

  const deleteLanguage = useCallback(() => {
    if (canDeleteLanguage) {
      deleteLanguageMutate({
        variables: {
          input: {
            id: language!.id,
          },
        },
      });
    }
  }, [language, canDeleteLanguage, deleteLanguageMutate]);

  return useMemo<LanguageReturn>(
    () => ({
      isNewLanguage,
      language: {
        ...language,
        name: nameInput,
      },
      setName: setNameInput,

      canCreateLanguage,
      createLanguage,
      languageCreating,
      createdLanguage,

      canUpdateLanguage,
      updateLanguage,
      languageUpdating,
      updatedLanguage,

      canDeleteLanguage,
      deleteLanguage,
      languageDeleting,
      deletedLanguage,
    }),
    [
      isNewLanguage,
      language,
      nameInput,
      canCreateLanguage,
      createLanguage,
      languageCreating,
      createdLanguage,
      canUpdateLanguage,
      updateLanguage,
      languageUpdating,
      updatedLanguage,
      canDeleteLanguage,
      deleteLanguage,
      languageDeleting,
      deletedLanguage,
    ],
  );
}
