import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { useAppDispatch, useSelectedLanguage, useSelectedWord } from '../store';
import { setSelectedWord } from '../store/words';
import { WordDetails } from './WordDetails';
import { WordsList } from './WordsList';

export const WordsPage: React.FC = () => {
    const selectedLanguage = useSelectedLanguage();
    const selectedWord = useSelectedWord();
    const dispatch = useAppDispatch();

    const [isCreatingWord, setIsCreatingWord] = useState(false);
    const isDetailsOpen = isCreatingWord || selectedWord !== null;

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
                'relative transition-all',
                {
                    'mr-[18rem] lg:mr-[24rem] xl:mr-[30rem] 2xl:mr-[36rem]':
                        isDetailsOpen,
                },
            )}
        >
            <WordsList />

            <CreateWordButton onClick={handleCreateWord} />
            <WordDetails
                word={selectedWord}
                isOpen={isDetailsOpen}
                onClose={handleCloseDetails}
            />
        </div>
    );
};

interface CreateWordButtonProps {
    onClick: () => void;
}

const CreateWordButton: React.FC<CreateWordButtonProps> = ({ onClick }) => {
    return (
        <div className='absolute right-6 bottom-3 z-10 w-14 h-14 flex items-center justify-center'>
            <div
                className='rounded-full group bg-white hover:bg-gray-700 border-white border-4 hover:border-gray-700 hover:border-8 transition-all cursor-pointer'
                onClick={onClick}
            >
                <BsFillPlusCircleFill className='w-12 h-12  text-gray-700 group-hover:text-white transition-colors' />
            </div>
        </div>
    );
};
