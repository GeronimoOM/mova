import { Component } from 'solid-js';

export type LanguageInputProps = {
  languageInput: string;
  onLanguageInput: (name: string) => void;
  isDisabled?: boolean;
};

export const LanguageInput: Component<LanguageInputProps> = (props) => (
  <input
    type="text"
    class="p-3 w-full outline-none bg-charcoal-100"
    value={props.languageInput}
    onInput={(e) => props.onLanguageInput(e.currentTarget.value)}
    disabled={props.isDisabled}
    spellcheck={false}
    autoCapitalize='off'
    onKeyDown={(e) => e.stopPropagation()}
  />
);
