import { Component } from 'solid-js';

export type SearchBarProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

const SearchBar: Component<SearchBarProps> = (props) => {
  return (
    <input
      type="text"
      value={props.query}
      onChange={(e) => props.onQueryChange(e.currentTarget.value)}
    />
  );
};

export default SearchBar;
