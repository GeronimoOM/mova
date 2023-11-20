import { Component } from 'solid-js';

export type LanguageInputProps = {
  languageInput: string;
  onLanguageInput: (name: string) => void;
  isDisabled?: boolean;
};

export const LanguageInput: Component<LanguageInputProps> = (props) => (
  <input
    type="text"
    class="w-full bg-charcoal-100 p-3 outline-none"
    value={props.languageInput}
    onInput={(e) => props.onLanguageInput(e.currentTarget.value)}
    disabled={props.isDisabled}
    spellcheck={false}
    autoCapitalize="off"
    onKeyDown={(e) => e.stopPropagation()}
  />
);
