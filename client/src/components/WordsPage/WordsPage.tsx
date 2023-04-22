import { Component, createSignal } from 'solid-js';
import SearchBar from './SearchBar';
import WordsList from './WordsList';

const WordsPage: Component = () => {
  const [searchQuery, setSearchQuery] = createSignal('');

  return (
    <div class="flex flex-col">
      <SearchBar query={searchQuery()} onQueryChange={setSearchQuery} />
      <WordsList />
    </div>
  );
};

export default WordsPage;
