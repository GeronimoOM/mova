import { useLazyQuery, useMutation } from '@apollo/client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  GetUserSettingsDocument,
  UpdateSettingsDocument,
} from '../api/types/graphql';
import { useAuthContext } from './AuthContext';

export type Font = 'default' | 'classic';

export type SettingsContextType = {
  font: Font;
  setFont: (font: Font) => void;
  includeMastered: boolean;
  setIncludeMastered: (includeMastered: boolean) => void;
};

export const SettingsContext = createContext<SettingsContextType>({
  font: 'default',
  setFont: () => {},
  includeMastered: true,
  setIncludeMastered: () => {},
});

const LOCAL_STORAGE_FONT_KEY = 'selectedFont';

type SettingsProviderProps = {
  children?: React.ReactNode;
};

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const { authToken } = useAuthContext();

  const [font, setFont] = useState<Font | null>(
    () => localStorage.getItem(LOCAL_STORAGE_FONT_KEY) as Font,
  );
  const [includeMastered, setIncludeMastered] = useState(true);

  const [fetchUserSettings] = useLazyQuery(GetUserSettingsDocument, {
    fetchPolicy: 'no-cache',
  });
  const [updateUserSettings] = useMutation(UpdateSettingsDocument);

  const setFontAndSave = useCallback(
    (font: Font, saveInApi = true) => {
      localStorage.setItem(LOCAL_STORAGE_FONT_KEY, font);
      if (saveInApi) {
        updateUserSettings({
          variables: {
            input: {
              selectedFont: font,
            },
          },
        });
      }

      setFont(font);
    },
    [updateUserSettings],
  );

  const setIncludeMasteredAndSave = useCallback(
    (includeMastered: boolean, saveInApi = true) => {
      if (saveInApi) {
        updateUserSettings({
          variables: {
            input: {
              includeMastered,
            },
          },
        });
      }

      setIncludeMastered(includeMastered);
    },
    [updateUserSettings],
  );

  const contextValue = useMemo<SettingsContextType>(
    () => ({
      font: font ?? 'default',
      setFont: setFontAndSave,
      includeMastered,
      setIncludeMastered: setIncludeMasteredAndSave,
    }),
    [font, setFontAndSave, includeMastered, setIncludeMasteredAndSave],
  );

  useEffect(() => {
    if (authToken) {
      fetchUserSettings().then(({ data: userSettings }) => {
        if (userSettings?.settings.selectedFont) {
          setFontAndSave(userSettings.settings.selectedFont as Font, false);
        }
        if (userSettings?.settings.includeMastered !== undefined) {
          setIncludeMasteredAndSave(
            userSettings.settings.includeMastered!,
            false,
          );
        }
      });
    }
  }, [
    authToken,
    font,
    fetchUserSettings,
    setFontAndSave,
    setIncludeMasteredAndSave,
  ]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => useContext(SettingsContext)!;
