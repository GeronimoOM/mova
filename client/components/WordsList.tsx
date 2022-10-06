import classNames from 'classnames';
import React, { useCallback, useEffect, useRef } from 'react';
import {
    useAppDispatch,
    useHasMoreWords,
    useIsFetchingWords,
    useSelectedLanguage,
    useSelectedWord,
    useWords,
    useWordsQuery,
} from '../store';
import { fetchWords, setSelectedWord } from '../store/words';
import { PartOfSpeechBadge } from './PartOfSpeechBadge';
import { WordSearchBar } from './WordSearchBar';

const WORDS_PER_PAGE = 15;

export const WordsList: React.FC = () => {
    const words = useWords();
    const isLoading = useIsFetchingWords();
    const hasMore = useHasMoreWords();
    const selectedLanguage = useSelectedLanguage();
    const query = useWordsQuery();
    const selectedWord = useSelectedWord();
    const dispatch = useAppDispatch();

    const handleFetchWords = useCallback(() => {
        if (selectedLanguage && !isLoading && hasMore) {
            dispatch(
                fetchWords({
                    languageId: selectedLanguage.id,
                    start: words.length,
                    limit: WORDS_PER_PAGE,
                    ...(query && { query }),
                }),
            );
        }
    }, [selectedLanguage, hasMore, isLoading, words.length, query, dispatch]);

    useEffect(() => {
        handleFetchWords();
    }, [selectedLanguage, query]);

    const lastWordNodeRef = useInfiniteScroll<HTMLDivElement>({
        onLoadMore: handleFetchWords,
    });

    const handleSelectWord = (wordId: string) => {
        dispatch(setSelectedWord(wordId));
    };

    return (
        <div className='h-screen flex flex-col items-center overflow-y-scroll'>
            <WordSearchBar /> 
            <div className='w-full max-w-[60rem] px-3'>
                <div className='mb-2 flex'>
                    <div className='h-12 px-3 py-1 basis-2/5 flex items-center justify-center border-b-2 border-b-gray-700'>
                        <span className='text-base text-gray-700 font-bold'>
                            WORD
                        </span>
                    </div>
                    <div className='h-12 px-3 py-1 basis-3/5 grow-1 flex items-center justify-center border-b-2 border-b-gray-700'>
                        <span className='text-base text-gray-700 font-bold'>
                            TRANSLATION
                        </span>
                    </div>
                </div>
                {words.map((word, index) => {
                    const isSelected = word.id === selectedWord?.id;
                    const isLast = index === words.length - 1;
                    return (
                        <div
                            className={classNames(
                                'm-1 relative flex flex-nowrap bg-gray-700 text-white cursor-pointer',
                                {
                                    'bg-gray-500': isSelected,
                                    'hover:bg-gray-500': !isSelected,
                                },
                            )}
                            key={word.id}
                            onClick={() => handleSelectWord(word.id)}
                            {...(isLast && { ref: lastWordNodeRef })}
                        >
                            <div className='h-12 px-5 py-1 basis-2/5 flex items-center justify-between'>
                                <span className='text-lg font-mono font-bold tracking-wide'>
                                    {word.original}
                                </span>
                                <PartOfSpeechBadge partOfSpeech={word.partOfSpeech} isDisabled={true} size='small' />
                            </div>
                            <div className='h-12 px-5 py-1 basis-3/5 grow-1 flex items-center justify-left'>
                                <span className='text-lg font-bold tracking-wide'>
                                    {word.translation}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

interface InfiniteScrollParams {
    onLoadMore: () => void;
}

function useInfiniteScroll<E extends HTMLElement>({
    onLoadMore,
}: InfiniteScrollParams): (node: E) => void {
    const observer = useRef<IntersectionObserver>();
    return useCallback(
        (node: E) => {
            if (observer.current) {
                observer.current.disconnect();
            }

            observer.current = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    onLoadMore();
                }
            });

            if (node) {
                observer.current.observe(node);
            }
        },
        [onLoadMore],
    );
}
