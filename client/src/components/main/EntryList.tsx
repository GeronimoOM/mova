import React, { FC, useEffect, useState } from 'react';

import EntryRow from './EntryRow';
import '../App.css';
import { useEntriesSelector, useLangSelector } from '../../store';
import { getLanguageEntries } from '../../api/client';
import { appendPage, select } from '../../store/entries';
import { useDispatch } from 'react-redux';

const EntryList: FC = () => {
  const selectedLang = useLangSelector()!;
  const entries = useEntriesSelector();
  const dispatch = useDispatch();

  const [showLoadMore, setShowLoadMore] = useState(false);

  const handleLoadMore = async () => {
    const { items, hasMore } = await getLanguageEntries(
      selectedLang.id,
      entries.length,
    );
    dispatch(appendPage(items));
    setShowLoadMore(hasMore);
  };

  useEffect(() => {
    handleLoadMore();
  }, [selectedLang]);

  return (
    <>
      <div>
        {entries.map((entry) => (
          <div
            className='entry-row'
            key={entry.id}
            onClick={() => dispatch(select(entry))}
          >
            <EntryRow key={entry.id} entry={entry} />
          </div>
        ))}
      </div>
      {showLoadMore && (
        <button className='confirm-button' onClick={() => handleLoadMore()}>
          Load More
        </button>
      )}
    </>
  );
};

export default EntryList;
