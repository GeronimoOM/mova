import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { cacheEvict } from '../api/cache';
import { initServiceWorker, resetServiceWorker } from '../sw/client/register';
import { LOCAL_STORAGE_TOKEN_KEY } from '../utils/constants';

export type AuthContextType = {
  authToken: string | null;
  setAuthToken: (token: string) => void;
  clearAuthToken: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  authToken: null,
  setAuthToken: () => {},
  clearAuthToken: () => {},
});

type AuthProviderProps = {
  children?: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY),
  );

  const setAuthToken = useCallback((token: string) => {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    setToken(token);
  }, []);

  const clearAuthToken = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    setToken(null);
    resetServiceWorker();
    cacheEvict();
  }, []);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      authToken: token,
      setAuthToken,
      clearAuthToken,
    }),
    [token, setAuthToken, clearAuthToken],
  );

  useEffect(() => {
    if (token) {
      initServiceWorker(token);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext)!;
