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

export type LanguageContextReturn = [
  Accessor<string | null>,
  Setter<string | null>,
];

export const LanguageContext = createContext<LanguageContextReturn>();

const LOCAL_STORAGE_LANGUAGE_KEY = 'selectedLanguage';

export const LanguageProvider: Component<ParentProps> = (props) => {
  const [language, setLanguage] = createSignal<string | null>(
    // TODO revert
    null, //localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY),
  );

  // createEffect(() => {
  //   if (language()) {
  //     localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, language()!);
  //   }
  // });

  const contextValue: LanguageContextReturn = [language, setLanguage];

  return (
    <LanguageContext.Provider value={contextValue}>
      {props.children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => useContext(LanguageContext)!;
