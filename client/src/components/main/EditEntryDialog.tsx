import React, { useState, FC } from 'react';
import {
  CreateEntryPropertyValue,
  CreateEntryPropertyValues,
  updateEntry,
} from '../../api/client';

import {
  PropertyType,
  Entry,
  partOfSpeechLabel,
  Property,
  PropertyValue,
} from '../../api/types';
import { useMutation } from '../../api/useMutation';
import { useLangSelector } from '../../store';
import '../App.css';

interface EditEntryDialogProps {
  entry: Entry;
  onEditEntry: (entry: Entry) => void;
  onClose: () => void;
  defs: Property[] | null;
  customValues: Record<string, PropertyValue>;
}

const EditEntryDialog: FC<EditEntryDialogProps> = ({
  onEditEntry,
  entry,
  onClose,
  defs,
  customValues,
}) => {
  const selectedLang = useLangSelector();
  const [original, setOriginal] = useState(entry.original);
  const [translation, setTranslation] = useState(entry.translation);
  const [
    propertyValues,
    setPropertyValues,
  ] = useState<CreateEntryPropertyValues>(customValues);

  const [editEntry, { loading }] = useMutation(() =>
    updateEntry(
      {
        original: original,
        translation,
        langId: selectedLang!.id,
        partOfSpeech: entry.partOfSpeech,
        customValues: propertyValues,
      },
      entry.id,
    ),
  );

  const handleSubmit = async () => {
    const result = await editEntry();
    if (result) {
      onEditEntry(result);
    }
    onClose();
  };

  return (
    <div className='dialog-overlay' onClick={onClose}>
      <dialog
        open
        className='center dialog'
        onClick={(event) => event.stopPropagation()}
      >
        {loading && <p>Loading...</p>}
        <div className='sticky'>
          <a className='topright' onClick={onClose}>
            <i className='fas fa-window-close'></i>
          </a>
          <h3>Edit Entry</h3>
        </div>
        <p>
          <label>
            ENTRY (IN {selectedLang!.name.toUpperCase()})
            <input
              className='basic-slide'
              name='original'
              placeholder='word or phrase'
              value={original}
              onChange={(event) => setOriginal(event.target.value)}
            />
          </label>
        </p>
        <p>
          <label>TRANSLATION</label> <br />
          <input
            className='basic-slide'
            name='translation'
            placeholder='translation'
            value={translation}
            onChange={(event) => setTranslation(event.target.value)}
          />
        </p>
        <p>
          <label>PART OF SPEECH: {partOfSpeechLabel(entry.partOfSpeech)}</label>{' '}
          <br />
        </p>
        {defs && (
          <div>
            <PropertiesForm
              propValues={propertyValues}
              defs={defs}
              onPropValueChange={(propId, propValue) =>
                setPropertyValues({ ...propertyValues, [propId]: propValue })
              }
            />
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <button className='confirm-button' onClick={() => handleSubmit()}>
            SUBMIT
          </button>
        </div>
      </dialog>
    </div>
  );
};

interface PropertiesFormProps {
  propValues: CreateEntryPropertyValues;
  onPropValueChange: (
    propId: string,
    propValue: CreateEntryPropertyValue,
  ) => void;
  defs: Property[];
}

const PropertiesForm: FC<PropertiesFormProps> = ({
  propValues,
  onPropValueChange,
  defs,
}) => {
  return (
    <div>
      {defs.map((prop) => (
        <PropertyRow
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

interface PropertyRowProps {
  prop: Property;
  propValue: CreateEntryPropertyValue;
  onPropValueChange: (propValue: CreateEntryPropertyValue) => void;
}

const PropertyRow: FC<PropertyRowProps> = ({
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

  if (!prop) return <div />;
  return (
    <div>
      <label className='label'>{prop.name.toUpperCase()}</label> <br />
      {prop.type === 'single' && prop.options && (
        <select
          className='basic-slide'
          onChange={(event) => {
            onPropValueChange({ option: event.target.value });
          }}
          value={propValue?.option}
          defaultValue={propValue ? propValue.option : ''}
        >
          {!propValue && (
            <option value='' disabled hidden>
              ---
            </option>
          )}
          {Object.entries(prop.options).map(([key, opt]) => (
            <option key={key} value={key}>
              {opt}
            </option>
          ))}
        </select>
      )}
      {prop.type === 'multi' && prop.options && (
        <div className='basic-slide'>
          {Object.entries(prop.options).map(([key, opt]) => (
            <label className='checkbox' key={key}>
              <input
                value={key}
                type='checkbox'
                checked={propValue && propValue.options?.includes(key)}
                className='basic-slide'
                onChange={(event) => {
                  handleMultiOptionChange(event.target.value);
                }}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
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
    </div>
  );
};

export default EditEntryDialog;
