import {
  Accessor,
  Component,
  ParentProps,
  Setter,
  createContext,
  createSignal,
  useContext,
} from 'solid-js';

export type WordContextReturn = [
  Accessor<string | null>,
  Setter<string | null>,
];

export const WordContext = createContext<WordContextReturn>();

export const WordProvider: Component<ParentProps> = (props) => {
  const [word, setWord] = createSignal<string | null>(null);

  const contextValue: WordContextReturn = [word, setWord];

  return (
    <WordContext.Provider value={contextValue}>
      {props.children}
    </WordContext.Provider>
  );
};

export const useWordContext = () => useContext(WordContext)!;
