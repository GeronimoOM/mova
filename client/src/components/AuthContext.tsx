import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type AuthContextType = [string | null, (token: string) => void];

export const AuthContext = createContext<AuthContextType>([null, () => {}]);

export const LOCAL_STORAGE_TOKEN_KEY = 'jwtToken';

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
