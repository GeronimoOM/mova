import React from 'react';

export interface SelectProps<T> {
  value: T | undefined;
  onSelect: (option: T) => void;
  options: T[];
  getKey?: (option: T) => string;
  getLabel?: (option: T) => string;
  placeholder?: string;
}

const PLACEHOLDER_KEY = '';
const defaultGetKey = (option: any): string => option;
const defaultGetLabel = (option: any): string => option;

function Select<T>(props: SelectProps<T>) {
  const {
    value,
    onSelect,
    options,
    getKey = defaultGetKey,
    getLabel = defaultGetLabel,
    placeholder,
  } = props;
  const optionByKey = new Map(
    options.map((option) => [getKey(option), option]),
  );
  const key = value && getKey(value);

  return (
    <select
      className='basic-slide'
      value={key ?? PLACEHOLDER_KEY}
      onChange={(event) => {
        onSelect(optionByKey.get(event.target.value)!);
      }}
    >
      <option key={PLACEHOLDER_KEY} hidden={!!value}>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={getKey(option)} value={getKey(option)}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}

export default Select;
