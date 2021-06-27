import React, { useState, FC } from 'react';
import { useDispatch } from 'react-redux';
import {
  getEntryProperties,
  SaveEntryPropertyValue,
  SaveEntryPropertyValues,
  updateEntry as updateEntryCall,
} from '../../api/client';

import {
  PropertyType,
  partOfSpeechLabels,
  Property,
  EntryFull,
} from '../../api/types';
import { useMutation } from '../../api/useMutation';
import { useQuery } from '../../api/useQuery';
import { useLangSelector } from '../../store';
import { updateOne } from '../../store/entries';
import '../App.css';
import EntryPropertiesForm from './EntryPropertiesForm';

interface EditEntryDialogProps {
  entry: EntryFull;
  onClose: () => void;
}

const EditEntryDialog: FC<EditEntryDialogProps> = ({ entry, onClose }) => {
  const selectedLang = useLangSelector()!;
  const dispatch = useDispatch();

  const { data: properties } = useQuery<Property[]>(
    () => getEntryProperties(entry.id),
    { deps: [entry.id] },
  );

  const [original, setOriginal] = useState(entry.original);
  const [translation, setTranslation] = useState(entry.translation);
  const [propertyValues, setPropertyValues] = useState<SaveEntryPropertyValues>(
    entry.customValues,
  );

  const [updateEntry] = useMutation(() =>
    updateEntryCall(
      {
        original: original,
        translation,
        customValues: propertyValues,
      },
      entry.id,
    ),
  );

  const handleSubmit = async () => {
    const result = await updateEntry();
    if (result) {
      dispatch(updateOne(result));
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
        <div className='sticky'>
          <a className='topright' onClick={onClose}>
            <i className='fas fa-window-close'></i>
          </a>
          <h3>Edit Entry</h3>
        </div>
        <p>
          <label>ENTRY (IN {selectedLang.name.toUpperCase()})</label> <br />
          <input
            className='basic-slide'
            name='original'
            placeholder='word or phrase'
            value={original}
            onChange={(event) => setOriginal(event.target.value)}
          />
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
          <label>
            PART OF SPEECH: {partOfSpeechLabels[entry.partOfSpeech]}
          </label>
          <br />
        </p>
        {properties && (
          <div>
            <EntryPropertiesForm
              properties={properties}
              propValues={propertyValues}
              onPropValueChange={(propId, propValue) =>
                setPropertyValues({ ...propertyValues, [propId]: propValue })
              }
            />
          </div>
        )}
        <button className='confirm-button' onClick={() => handleSubmit()}>
          SUBMIT
        </button>
      </dialog>
    </div>
  );
};

export default EditEntryDialog;
