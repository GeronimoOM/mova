import classNames from 'classnames';
import React from 'react';
import { useAppDispatch, useSelectedWord, useWords } from '../store';
import { setSelectedWord } from '../store/words';
import { Word } from '../types';

export const WordsList: React.FC = () => {
    const words = useWords();
    const selectedWord = useSelectedWord();
    const dispatch = useAppDispatch();

    return (
        <div className='w-full max-w-[60rem] px-3'>
            <WordListHeader />
            <WordListRows
                words={words}
                selected={selectedWord}
                onSelect={(word) => dispatch(setSelectedWord(word.id))}
            />
        </div>
    );
};

const WordListHeader: React.FC = () => (
    <div className='mb-2 bg-white/50 backdrop-blur-sm flex flex-nowrap justify-items-stretch'>
        <div className='h-12 px-3 py-1 basis-1/3 flex items-center justify-center border-b-2 border-b-gray-700'>
            <span className='text-xl text-gray-700 font-bold'>Word</span>
        </div>
        <div className='h-12 px-3 py-1 basis-2/3 grow-1 flex items-center justify-center border-b-2 border-b-gray-700'>
            <span className='text-xl text-gray-700 font-bold'>Translation</span>
        </div>
    </div>
);


export interface WordListProps {
    words: Word[];
    selected: Word | null;
    onSelect: (word: Word) => void;
}

const WordListRows: React.FC<WordListProps> = ({
    words,
    selected,
    onSelect,
}) => (
    <>
        {words.map((word) => {
            const isSelected = word.id === selected?.id;
            return (
                <div
                    className={classNames(
                        'm-1 flex flex-nowrap justify-items-stretch bg-gray-700 hover:bg-gray-500 text-white',
                        {
                            'bg-gradient-to-r from-sky-400 to-blue-400':
                                isSelected,
                            'hover:border-x-sky-400': isSelected,
                            'text-gray-700': isSelected,
                        },
                    )}
                    key={word.id}
                    onClick={() => onSelect(word)}
                >
                    <div className='h-12 px-5 py-1 basis-1/3 flex items-center justify-left'>
                        <span className='text-lg font-mono font-bold tracking-wide'>
                            {word.original}
                        </span>
                    </div>
                    <div className='h-12 px-5 py-1 basis-2/3 grow-1 flex items-center justify-left'>
                        <span className='text-lg'>{word.translation}</span>
                    </div>
                </div>
            );
        })}
    </>
);