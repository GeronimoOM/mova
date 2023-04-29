import {
  Accessor,
  Component,
  ParentProps,
  Setter,
  createContext,
  createSignal,
  useContext,
} from 'solid-js';

export type LanguageContextReturn = [
  Accessor<string | null>,
  Setter<string | null>,
];

export const LanguageContext = createContext<LanguageContextReturn>();

export const LanguageProvider: Component<ParentProps> = (props) => {
  const [language, setLanguage] = createSignal<string | null>(null);

  const contextValue: LanguageContextReturn = [language, setLanguage];

  return (
    <LanguageContext.Provider value={contextValue}>
      {props.children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => useContext(LanguageContext)!;
