import {
  Accessor,
  Component,
  ParentProps,
  Setter,
  createContext,
  createSignal,
  useContext,
} from 'solid-js';

export type LanguageContextProps = [Accessor<string | null>, Setter<string>];

export const LanguageContext = createContext<LanguageContextProps>();

export const LanguageProvider: Component<ParentProps> = (props) => {
  const [language, setLanguage] = createSignal<string | null>(null);

  const contextValue: LanguageContextProps = [language, setLanguage];

  return (
    <LanguageContext.Provider value={contextValue}>
      {props.children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => useContext(LanguageContext)!;
