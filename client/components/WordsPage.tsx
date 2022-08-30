import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { useAppDispatch, useSelectedLanguage, useSelectedWord } from '../store';
import { fetchWords, setSelectedWord } from '../store/words';
import { WordDetails } from './WordDetails';

import { WordSearchBar } from './WordSearchBar';
import { WordsList } from './WordsList';

export const WordsPage: React.FC = () => {
    const selectedLanguage = useSelectedLanguage();
    const selectedWord = useSelectedWord();
    const dispatch = useAppDispatch();

    const [isCreatingWord, setIsCreatingWord] = useState(false);
    const isDetailsOpen = isCreatingWord || selectedWord !== null;

    useEffect(() => {
        if (selectedLanguage) {
            dispatch(fetchWords({ languageId: selectedLanguage.id }));
        }
    }, [dispatch, selectedLanguage]);

    useEffect(() => {
        if (selectedWord) {
            setIsCreatingWord(false);
        }
    }, [selectedWord]);

    const handleCreateWord = () => {
        setIsCreatingWord(true);
        dispatch(setSelectedWord(null));
    };

    const handleCloseDetails = () => {
        setIsCreatingWord(false);
        dispatch(setSelectedWord(null));
    };


    return (
        <div
            className={classNames(
                'relative h-full flex flex-col items-center transition-all',
                {
                    'mr-[18rem] lg:mr-[24rem] xl:mr-[30rem] 2xl:mr-[36rem]': isDetailsOpen,
                },
            )}
        >
            {/* <WordSearchBar /> */}
            <WordsList />
            <CreateWordButton onClick={handleCreateWord}/>

            <WordDetails word={selectedWord} isOpen={isDetailsOpen} onClose={handleCloseDetails} />
        </div>
    );
};

interface CreateWordButtonProps {
    onClick: () => void;
}

const CreateWordButton: React.FC<CreateWordButtonProps> = ({ onClick }) => {
    return (
        <div className='absolute w-14 h-14 right-3 bottom-3 flex items-center justify-center'>
            <div
                className='rounded-full group border-gray-700 hover:border-8 hover:bg-gray-700 transition-all'
                onClick={onClick}
            >
                <BsFillPlusCircleFill className='w-12 h-12  text-gray-700 group-hover:text-white transition-colors' />
            </div>
        </div>
    );
};
