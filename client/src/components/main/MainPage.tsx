import React, { FC, useState } from 'react';

import EntryList from './EntryList';
import EntryDetailed from './EntryDetailed';
import AddEntryDialog from './AddEntryDialog';
import '../App.css';
import { useEntrySelector } from '../../store';

const MainPage: FC = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const selectedEntry = useEntrySelector();

  return (
    <div>
      <h3>Main Page</h3>
      <div className='search-container'>
        <form action=''>
          <input
            type='text'
            placeholder='Search...'
            name='search'
            className='search-input'
          />
          <button type='submit' className='search-submit '>
            <i className='fa fa-search'></i>
          </button>
        </form>
      </div>

      <div className='grid-container-2-equal'>
        <div className='grid-item'>
          <EntryList />
        </div>
        {selectedEntry && (
          <div className='grid-item entry-detailed'>
            <EntryDetailed entry={selectedEntry} />
          </div>
        )}
      </div>

      <button className='round-button' onClick={() => setOpenAdd(true)}>
        <i className='fas fa-plus'></i>
      </button>
      {openAdd && <AddEntryDialog onClose={() => setOpenAdd(false)} />}
    </div>
  );
};

export default MainPage;
