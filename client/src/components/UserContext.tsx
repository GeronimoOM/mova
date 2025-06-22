import { useLazyQuery, useMutation } from '@apollo/client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '../api/client';
import {
  GetUserSettingsDocument,
  LoginDocument,
  UpdateSettingsDocument,
  UserSettings,
} from '../api/types/graphql';
import { AppRoute } from '../routes';
import { resetServiceWorker } from '../sw/client/register';
import { LOCAL_STORAGE_TOKEN_KEY } from '../utils/constants';
import {
  clearUserSettingsFromLocal,
  loadUserSettingsFromLocal,
  saveUserSettingsToLocal,
} from '../utils/settings';
import { Locale, setLocale } from '../utils/translator';

export type UserContextType = {
  authToken: string | null;
  isLoginLoading: boolean;
  isLoginError: boolean;
  login: (name: string, password: string) => Promise<string | null>;
  logout: () => void;

  settings: UserSettings;
  setSettings: (settings: UserSettings) => void;
};

export const UserContext = createContext<UserContextType>({
  authToken: null,
  isLoginLoading: false,
  isLoginError: false,
  login: async () => {
    return null;
  },
  logout: () => {},

  settings: {},
  setSettings: () => {},
});

type UserProviderProps = {
  children?: React.ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const navigate = useNavigate();

  const [isLoginLoading, setLoginLoading] = useState(false);
  const [isLoginError, setLoginError] = useState(false);

  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY),
  );
  const [settings, setLocalSettings] = useState<UserSettings>(
    loadUserSettingsFromLocal,
  );

  const [loginMutation] = useMutation(LoginDocument);
  const [fetchUserSettings] = useLazyQuery(GetUserSettingsDocument, {
    fetchPolicy: 'no-cache',
  });
  const [updateUserSettings] = useMutation(UpdateSettingsDocument);

  const setSettings = useCallback(
    (userSettings: UserSettings, saveInApi = true) => {
      saveUserSettingsToLocal(userSettings);

      setLocalSettings((localUserSettings) => ({
        ...localUserSettings,
        ...userSettings,
      }));

      if (saveInApi) {
        updateUserSettings({
          variables: {
            input: userSettings,
          },
        });
      }
    },
    [updateUserSettings],
  );

  const login = useCallback(
    async (name: string, password: string) => {
      let authToken: string | null = null;
      setLoginLoading(true);
      try {
        const loginResult = await loginMutation({
          variables: {
            input: {
              name,
              password,
            },
          },
        });

        authToken = loginResult.data?.login ?? null;

        if (authToken) {
          localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, authToken);

          const userSettingsResult = await fetchUserSettings();
          const userSettings = userSettingsResult.data?.settings;
          if (userSettings) {
            setSettings(userSettings, false);
          }
        }
      } finally {
        setLoginLoading(false);
        setLoginError(!authToken);
      }

      if (authToken) {
        setAuthToken(authToken);
        navigate(AppRoute.Default);
      }

      return authToken;
    },
    [fetchUserSettings, loginMutation, navigate, setSettings],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    setLocalSettings(({ selectedLocale, selectedFont }) => ({
      selectedLocale,
      selectedFont,
    }));
    clearUserSettingsFromLocal();
    setAuthToken(null);
    client.clearStore();
    resetServiceWorker();
    navigate(AppRoute.Default);
  }, [navigate]);

  useEffect(() => {
    if (settings.selectedLocale) {
      setLocale(settings.selectedLocale as Locale);
    }
  }, [settings]);

  const contextValue = useMemo<UserContextType>(
    () => ({
      authToken,
      isLoginLoading,
      isLoginError,
      login,
      logout,

      settings,
      setSettings,
    }),
    [
      authToken,
      isLoginError,
      isLoginLoading,
      login,
      logout,
      setSettings,
      settings,
    ],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
