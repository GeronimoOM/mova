import React, { useEffect, useRef } from 'react';
import { PartOfSpeech } from '../types';
import { PartOfSpechBadgeConfig, PartOfSpeechBadge, partsOfSpeechConfig } from './PartOfSpeechBadge';

interface PartOfSpeechSelect {
    selected: PartOfSpeech | null;
    onSelect: (partOfSpeech: PartOfSpeech) => void;
    isOpen: boolean;
    onOpen: (isOpen: boolean) => void;
    isDisabled?: boolean;
}

export const PartOfSpeechSelect: React.FC<PartOfSpeechSelect> = ({
    selected,
    onSelect,
    isOpen,
    onOpen,
    isDisabled,
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            onOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return (
        <div className='relative cursor-default'>
            <div className='border-2 border-transparent rounded overflow-hidden'>
                <PartOfSpeechBadge
                    partOfSpeech={selected}
                    onClick={() => onOpen(true)}
                    isDisabled={isDisabled}
                    size='large'
                />
            </div>
            {isOpen && (
                <div className='flex flex-col absolute z-10 top-0 bg-gray-600 rounded overflow-hidden border-2' ref={dropdownRef}>
                    {getOrderedPartsOfSpeech(selected).map(
                        ([partOfSpeech]) => (
                            <PartOfSpeechBadge
                                key={partOfSpeech}
                                partOfSpeech={partOfSpeech as PartOfSpeech}
                                onClick={() =>
                                    onSelect(partOfSpeech as PartOfSpeech)
                                }
                                size='large'
                            />
                        ),
                    )}
                </div>
            )}
        </div>
    );
};

function getOrderedPartsOfSpeech(
    first: PartOfSpeech | null,
): [PartOfSpeech, PartOfSpechBadgeConfig][] {
    return (
        !first
            ? Object.entries(partsOfSpeechConfig)
            : [
                  [first, partsOfSpeechConfig[first]],
                  ...Object.entries(partsOfSpeechConfig).filter(
                      ([partOfSpeech]) => partOfSpeech !== first,
                  ),
                  ,
              ]
    ) as [PartOfSpeech, PartOfSpechBadgeConfig][];
}

