import React, { FC } from 'react';
import {
  SaveEntryPropertyValues,
  SaveEntryPropertyValue,
} from '../../api/client';
import { Property, PropertyType } from '../../api/types';
import Select from '../utils/Select';

export interface EntryPropertiesFormProps {
  properties: Property[];
  propValues: SaveEntryPropertyValues;
  onPropValueChange: (
    propId: string,
    propValue: SaveEntryPropertyValue,
  ) => void;
}

const EntryPropertiesForm: FC<EntryPropertiesFormProps> = ({
  properties,
  propValues,
  onPropValueChange,
}) => {
  return (
    <div>
      {properties.map((prop) => (
        <EntryPropertyRow
          key={prop.id}
          prop={prop}
          propValue={propValues[prop.id]}
          onPropValueChange={(propValue) =>
            onPropValueChange(prop.id, propValue)
          }
        />
      ))}
    </div>
  );
};

interface EntryPropertyRowProps {
  prop: Property;
  propValue: SaveEntryPropertyValue | undefined;
  onPropValueChange: (propValue: SaveEntryPropertyValue) => void;
}

const EntryPropertyRow: FC<EntryPropertyRowProps> = ({
  prop,
  propValue,
  onPropValueChange,
}) => {
  const handleMultiOptionChange = (option: string) => {
    const options = propValue ? propValue.options! : [];
    const newOptions = options.includes(option)
      ? options.filter((opt) => opt !== option)
      : [...options, option];
    onPropValueChange({ options: newOptions });
  };

  return (
    <p>
      <label className='label'>{prop.name.toUpperCase()}</label> <br />
      {prop.type === PropertyType.SingleOption && (
        <Select
          value={propValue?.option}
          onSelect={(option) => onPropValueChange({ option })}
          options={Object.keys(prop.options!)}
          getLabel={(option) => prop.options![option]}
          placeholder={'---'}
        />
      )}
      {prop.type === PropertyType.MultiOption && (
        <>
          {Object.entries(prop.options!).map(([key, opt]) => (
            <React.Fragment key={key}>
              <input
                key={key}
                value={key}
                onChange={(e) => handleMultiOptionChange(e.target.value)}
                type='checkbox'
                className='basic-slide'
              />
              <label>{opt}</label>
            </React.Fragment>
          ))}
        </>
      )}
      {prop.type === PropertyType.Text && (
        <textarea
          className='basic-slide'
          onChange={(event) => {
            onPropValueChange({ text: event.target.value });
          }}
          value={propValue?.text}
        />
      )}
    </p>
  );
};

export default EntryPropertiesForm;
