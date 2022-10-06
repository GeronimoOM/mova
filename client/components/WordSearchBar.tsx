import React, { useRef, useState } from 'react';
import { useAppDispatch, useWordsQuery } from '../store';
import { setWordsQuery } from '../store/words';
import { FaSearch } from 'react-icons/fa';

const MIN_QUERY_LENGTH = 3;

export const WordSearchBar: React.FC = () => {
    const query = useWordsQuery();
    const dispatch = useAppDispatch();

    const [queryDraft, setQueryDraft] = useState(query ?? '');

    const setQueryTimeout = useRef<NodeJS.Timeout>();
    const handleQueryChange = (query: string) => {
        setQueryDraft(query);
        clearTimeout(setQueryTimeout.current);

        setQueryTimeout.current = setTimeout(
            () =>
                dispatch(
                    setWordsQuery(
                        query.length < MIN_QUERY_LENGTH ? null : query,
                    ),
                ),
            500,
        );
    };

    return (
        <div className='w-full max-w-[60rem] px-4'>
            <div className='relative flex flex-row items-center text-white'>
                <FaSearch className='w-6 h-6 absolute left-0 m-3' />
                <input
                    type='text'
                    className='w-full p-2 pl-12 border-2 bg-gray-700 
            text-lg font-bold tracking-wide outline-none'
                    value={queryDraft}
                    onChange={(e) => handleQueryChange(e.target.value)}
                />
            </div>
        </div>
    );
};
