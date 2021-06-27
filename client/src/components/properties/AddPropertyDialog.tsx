import React, { useState, FC } from 'react';

import { useMutation } from '../../api/useMutation';
import { PropertyType, Language, PartOfSpeech } from '../../api/types';
import '../App.css';
import { createProperty } from '../../api/client';

interface PropetyDialogProps {
  selectedLang: Language;
  onClose: () => void;
}

const AddPropertyDialog: FC<PropetyDialogProps> = ({
  selectedLang,
  onClose,
}) => {
  const [inputList, setInputList] = useState<string[]>(['']);
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<PropertyType>(PropertyType.Text);
  const [pos, setPos] = useState<PartOfSpeech>(PartOfSpeech.Noun);

  const [addProperty, { loading }] = useMutation(() =>
    createProperty({
      name,
      type,
      langId: selectedLang.id,
      partOfSpeech: pos,
      options:
        type === PropertyType['SingleOption'] ||
        type === PropertyType['MultiOption']
          ? inputList.slice(0, inputList.length - 1)
          : undefined,
    }),
  );

  const handleSubmit = async () => {
    await addProperty();
    onClose();
  };

  const handleInputChange = (value: string, index: number) => {
    const list = [...inputList];
    list[index] = value;
    setInputList(list);
  };

  const handleRemoveClick = (index: number) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const handleAddClick = () => {
    setInputList([...inputList, '']);
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
          <h3>Add New Property</h3>
        </div>
        <p>
          <label>PROPERTY NAME</label>
          <br />
          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            className='basic-slide'
            placeholder='Property name'
          />
        </p>
        <p>
          <label>PROPERTY TYPE</label>
          <br />
          <select
            className='basic-slide'
            value={type}
            onChange={(event) => {
              setType(event.target.value as PropertyType);
            }}
          >
            {Object.entries(PropertyType).map(([typeName, typeValue]) => (
              <option className='option' key={typeValue} value={typeValue}>
                {typeName}
              </option>
            ))}
            <option value='text'>text</option>
            <option value='single'>single option</option>
            <option value='multi'>multi option</option>
            <option value='table'>table</option>
          </select>
        </p>
        <p>
          <label>PART OF SPEECH</label>
          <br />
          <select
            className='basic-slide'
            onChange={(event) => setPos(event.target.value as PartOfSpeech)}
            value={pos}
          >
            {Object.entries(PartOfSpeech).map(([posName, posValue]) => (
              <option className='option' key={posValue} value={posValue}>
                {posName}
              </option>
            ))}
          </select>
        </p>
        {type === 'text' && <div />}
        {(type === 'single' || type === 'multi' || type === 'table') && (
          <div>
            <label>OPTIONS</label>
            {inputList.map((x, i) => {
              return (
                <div className='box' key={i}>
                  <input
                    className='basic-slide'
                    name='firstName'
                    placeholder={
                      type === 'table'
                        ? 'Enter table cell'
                        : 'Enter property option'
                    }
                    value={x}
                    onChange={(e) => handleInputChange(e.target.value, i)}
                  />
                  {inputList.length !== 1 && (
                    <button
                      onClick={() => handleRemoveClick(i)}
                      className='submit-button'
                    >
                      x
                    </button>
                  )}
                  {inputList.length - 1 === i && (
                    <>
                      <br />
                      <button
                        className='submit-button'
                        onClick={handleAddClick}
                      >
                        Add {type === 'table' ? 'table cell' : 'option'}
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <button className='confirm-button' onClick={() => handleSubmit()}>
          {loading ? '...' : 'SUBMIT'}
        </button>
      </dialog>
    </div>
  );
};

export default AddPropertyDialog;
