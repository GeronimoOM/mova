import React, { useState, FC } from 'react';
import { useDispatch } from 'react-redux';
import {
  createEntry as createEntryCall,
  SaveEntryPropertyValue,
  SaveEntryPropertyValues,
  getLanguageProperties,
} from '../../api/client';
import { PartOfSpeech, Property, partOfSpeechLabels } from '../../api/types';
import { useMutation } from '../../api/useMutation';
import { useQuery } from '../../api/useQuery';
import { useLangSelector } from '../../store';
import { createOne } from '../../store/entries';
import '../App.css';
import Select from '../utils/Select';
import EntryPropertiesForm from './EntryPropertiesForm';

interface AddEntryDialogProps {
  onClose: () => void;
}

const AddEntryDialog: FC<AddEntryDialogProps> = ({ onClose }) => {
  const selectedLang = useLangSelector()!;
  const dispatch = useDispatch();

  const [original, setOriginal] = useState('');
  const [translation, setTranslation] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech>(
    PartOfSpeech.Noun,
  );
  const [propertyValues, setPropertyValues] = useState<SaveEntryPropertyValues>(
    {},
  );

  const { data: properties } = useQuery<Property[]>(() =>
    getLanguageProperties(selectedLang.id, partOfSpeech).then(
      (page) => page.items,
    ),
  );

  const [createEntry] = useMutation(() =>
    createEntryCall({
      original,
      translation,
      langId: selectedLang.id,
      partOfSpeech,
      customValues: propertyValues,
    }),
  );

  const handleSubmit = async () => {
    const result = await createEntry();
    if (result) {
      dispatch(createOne(result));
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
          <h3>Add New Entry</h3>
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
          <label>PART OF SPEECH</label> <br />
          <Select
            value={partOfSpeech}
            onSelect={setPartOfSpeech}
            options={Object.values(PartOfSpeech)}
            getLabel={(partOfSpeech) => partOfSpeechLabels[partOfSpeech]}
          />
        </p>
        <div>
          <EntryPropertiesForm
            properties={properties ?? []}
            propValues={propertyValues}
            onPropValueChange={(propId, propValue) =>
              setPropertyValues({ ...propertyValues, [propId]: propValue })
            }
          />
        </div>
        <button className='confirm-button' onClick={() => handleSubmit()}>
          SUBMIT
        </button>
      </dialog>
    </div>
  );
};

export default AddEntryDialog;
