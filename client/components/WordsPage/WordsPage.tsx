'use client';

import React, { useEffect, useState } from 'react';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { useAppDispatch, useSelectedWord } from '../../store';
import { setSelectedWord } from '../../store/words';
import { PageWithSidebar } from '../PageWithSidebar';
import { WordDetails } from './WordDetails';
import { WordsList } from './WordsList';

export const WordsPage: React.FC = () => {
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

    const mainContent = (
        <div className='relative'>
            <WordsList />
            <CreateWordButton onCreate={handleCreateWord} />
        </div>
    )

    const sidebarContent = (
        <WordDetails
            word={selectedWord}
            isOpen={isDetailsOpen}
            onClose={handleCloseDetails}
        />
    )

    return (
        <PageWithSidebar 
            mainContent={mainContent}
            sidebarContent={sidebarContent}
            isSidebarOpen={isDetailsOpen}
        />
    );
};

interface CreateWordButtonProps {
    onCreate: () => void;
}

const CreateWordButton: React.FC<CreateWordButtonProps> = ({ onCreate }) => {
    return (
        <div className='absolute right-6 bottom-3 z-10 w-14 h-14 flex items-center justify-center'>
            <div
                className='rounded-full group bg-white hover:bg-gray-700 border-white border-4 hover:border-gray-700 hover:border-8 transition-all cursor-pointer'
                onClick={onCreate}
            >
                <BsFillPlusCircleFill className='w-12 h-12  text-gray-700 group-hover:text-white transition-colors' />
            </div>
        </div>
    );
};
