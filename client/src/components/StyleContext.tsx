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

export type StyleContextType = [font: Font, setFont: (font: Font) => void];

export const StyleContext = createContext<StyleContextType>([
  'default',
  () => {},
]);

const LOCAL_STORAGE_FONT_KEY = 'selectedFont';

type StyleProviderProps = {
  children?: React.ReactNode;
};

export const StyleProvider: React.FC<StyleProviderProps> = ({ children }) => {
  const { authToken } = useAuthContext();

  const [font, setFont] = useState<Font | null>(
    () => localStorage.getItem(LOCAL_STORAGE_FONT_KEY) as Font,
  );

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

  const contextValue = useMemo<StyleContextType>(
    () => [font ?? 'default', setFontAndSave],
    [font, setFontAndSave],
  );

  useEffect(() => {
    if (authToken && !font) {
      fetchUserSettings().then(({ data: userSettings }) => {
        if (userSettings?.settings.selectedFont) {
          setFontAndSave(userSettings.settings.selectedFont as Font, false);
        }
      });
    }
  }, [authToken, font, fetchUserSettings, setFontAndSave]);

  return (
    <StyleContext.Provider value={contextValue}>
      {children}
    </StyleContext.Provider>
  );
};

export const useStyleContext = () => useContext(StyleContext)!;
