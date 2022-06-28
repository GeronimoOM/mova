import classNames from 'classnames';
import React from 'react';
import { Word } from '../data/words';

export interface WordListProps {
    words: Word[];
    selected: Word | null;
    onSelect: (word: Word) => void;
    isLoading: boolean;
    isError: boolean;
}

export const WordList: React.FC<WordListProps> = ({
    words,
    selected,
    onSelect,
    isLoading,
    isError,
}) => {
    return (
        <div className='mx-auto w-full max-w-4xl p-2 flex flex-col justify-items-stretch'>
            <div
                className='
            sticky top-0 mb-2 bg-white/50 backdrop-blur-sm flex flex-nowrap justify-items-stretch'
            >
                <div className='h-12 px-3 py-1 basis-1/3 flex items-center justify-center border-b-2 border-b-gray-700'>
                    <span className='text-xl text-gray-700 font-bold'>
                        Word
                    </span>
                </div>
                <div className='h-12 px-3 py-1 basis-2/3 grow-1 flex items-center justify-center border-b-2 border-b-gray-700'>
                    <span className='text-xl text-gray-700 font-bold'>
                        Translation
                    </span>
                </div>
            </div>

            {isLoading ? (
                <Loading />
            ) : words.length > 0 ? (
                <WordListRows
                    words={words}
                    selected={selected}
                    onSelect={onSelect}
                />
            ) : (
                <Empty />
            )}
        </div>
    );
};

const WordListRows: React.FC<
    Pick<WordListProps, 'words' | 'selected' | 'onSelect'>
> = ({ words, selected, onSelect }) => (
    <>
        {words.map((word) => {
            const isSelected = word.id === selected?.id;
            return (
                <div
                    className={classNames(
                        'm-1 flex flex-nowrap justify-items-stretch bg-gray-700 hover:bg-gray-500 rounded-xl text-white',
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

const LoadingItem: React.FC = () => (
    <tr className='h-9'>
        <td
            colSpan={2}
            className='rounded-t px-4 py-1 animate-pulse bg-slate-50 border-x-4 border-x-slate-100 border-b-4 border-b-slate-200'
        ></td>
    </tr>
);

const Loading: React.FC = () => (
    <>
        {Array.from(Array(5).keys()).map((i) => (
            <LoadingItem key={i} />
        ))}
    </>
);

const Empty: React.FC = () => (
    <tr>
        <td colSpan={2}>
            <span className='text-sm text-gray-400'>
                Time to add the first word...
            </span>
        </td>
    </tr>
);
