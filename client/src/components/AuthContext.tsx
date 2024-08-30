import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { LOCAL_STORAGE_TOKEN_KEY } from '../utils/constants';

export type AuthContextType = [string | null, (token: string) => void];

export const AuthContext = createContext<AuthContextType>([null, () => {}]);

type AuthProviderProps = {
  children?: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY),
  );

  const setTokenAndSave = useCallback((language: string) => {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, language);
    setToken(language);
  }, []);

  const contextValue = useMemo<AuthContextType>(
    () => [token, setTokenAndSave],
    [token, setTokenAndSave],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext)!;
