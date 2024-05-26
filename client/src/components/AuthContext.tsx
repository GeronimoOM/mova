import {
  Accessor,
  Component,
  ParentProps,
  Setter,
  createContext,
  createSignal,
  useContext,
  createEffect,
} from 'solid-js';

export type AuthContextReturn = [
  Accessor<string | null>,
  Setter<string | null>,
];

export const AuthContext = createContext<AuthContextReturn>();

export const LOCAL_STORAGE_TOKEN_KEY = 'jwtToken';

export const AuthProvider: Component<ParentProps> = (props) => {
  const [token, setToken] = createSignal<string | null>(
    localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY),
  );

  createEffect(() => {
    if (token()) {
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token()!);
    }
  });

  const contextValue: AuthContextReturn = [token, setToken];

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext)!;
