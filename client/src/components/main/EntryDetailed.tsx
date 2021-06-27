import React, { FC } from 'react';

import { Entry, EntryFull, isEntryFull, PropertyType } from '../../api/types';
import { getEntry, deleteEntry as deleteEntryCall } from '../../api/client';
import '../App.css';
import EditEntryDialog from './EditEntryDialog';
import { useMutation } from '../../api/useMutation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteOne, loadOne, select } from '../../store/entries';
import { useEffect } from 'react';

interface EntryDetailedProps {
  entry: Entry | EntryFull;
}

const EntryDetailed: FC<EntryDetailedProps> = ({ entry }) => {
  const dispatch = useDispatch();

  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    if (!isEntryFull(entry)) {
      getEntry(entry.id).then((entryFull) => dispatch(loadOne(entryFull)));
    }
  }, [entry]);

  const [deleteEntry] = useMutation(() => deleteEntryCall(entry));

  const handleDelete = async () => {
    const result = await deleteEntry();
    if (result) {
      dispatch(deleteOne(result.id));
    }
  };

  return (
    <div className='container entry-detailed '>
      <a className='topright'>
        <i
          className='far fa-edit'
          style={{ marginRight: '2px' }}
          onClick={() => setOpenEdit(true)}
        ></i>
        <i
          className='fas fa-window-close'
          style={{ marginRight: '2px' }}
          onClick={() => dispatch(select(undefined))}
        ></i>
        <i className='fas fa-trash-alt' onClick={handleDelete}></i>
      </a>
      <span className='word-title'>{entry.original}</span>
      <div style={{ textAlign: 'left' }}>
        {/* <div className='gender-letter gender-m'>M</div> */}
        <br />
        <i>({entry.partOfSpeech})</i>
        <br />
        <b>{entry.translation}</b>
        {isEntryFull(entry) &&
          Object.values(entry.customValues).map((val) => (
            <p key={val.definition.id}>
              <b>{val.definition.name}: </b>
              {val.definition.type === PropertyType.Text && val.text}
              {val.definition.type === PropertyType.SingleOption &&
                val.option &&
                val.definition.options![val.option]}
              {/** MultiOption */}
            </p>
          ))}
      </div>
      {isEntryFull(entry) && openEdit && (
        <EditEntryDialog entry={entry} onClose={() => setOpenEdit(false)} />
      )}
    </div>
  );
};

export default EntryDetailed;
