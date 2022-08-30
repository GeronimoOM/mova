import classNames from 'classnames';
import React, { DOMElement, useEffect, useRef } from 'react';
import { PartOfSpeech } from '../types';

interface PartOfSpechBadgeConfig {
    short: string;
    color: string;
}

const partsOfSpeechConfig: Record<PartOfSpeech, PartOfSpechBadgeConfig> = {
    [PartOfSpeech.Noun]: {
        short: 'N',
        color: 'sky',
    },
    [PartOfSpeech.Verb]: {
        short: 'V',
        color: 'yellow',
    },
    [PartOfSpeech.Adjective]: {
        short: 'Adj',
        color: 'teal',
    },
    [PartOfSpeech.Adverb]: {
        short: 'Adv',
        color: 'orange',
    },
    [PartOfSpeech.Pronoun]: {
        short: 'Pro',
        color: 'violet',
    },
    [PartOfSpeech.Misc]: {
        short: 'Msc',
        color: 'rose',
    },
};

const unknownPartOfSpeechBadgeConfig = {
    short: '?',
    color: 'stone',
};

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
        <div className='relative'>
            <div className='border-2 border-transparent rounded overflow-hidden'>
                <PartOfSpeechBadge
                    partOfSpeech={selected}
                    onClick={() => onOpen(true)}
                    isDisabled={isDisabled}
                />
            </div>
            {isOpen && (
                <div className='flex flex-col absolute z-10 top-0 bg-gray-600 rounded overflow-hidden border-2' ref={dropdownRef}>
                    {getOrderedPartsOfSpeech(selected).map(
                        ([partOfSpeech, { short, color }]) => (
                            <PartOfSpeechBadge
                                key={partOfSpeech}
                                partOfSpeech={partOfSpeech as PartOfSpeech}
                                onClick={() =>
                                    onSelect(partOfSpeech as PartOfSpeech)
                                }
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

interface PartOfSpeechBadgeProps {
    partOfSpeech: PartOfSpeech | null;
    onClick?: () => void;
    isDisabled?: boolean;
}

const PartOfSpeechBadge: React.FC<PartOfSpeechBadgeProps> = ({
    partOfSpeech,
    onClick,
    isDisabled,
}) => {
    const { short, color } = partOfSpeech
        ? partsOfSpeechConfig[partOfSpeech]
        : unknownPartOfSpeechBadgeConfig;

    return (
        <div
            className={classNames('p-1.5', {
                [`hover:bg-${color}-600 cursor-pointer`]: !isDisabled,
            })}
            onClick={onClick}
        >
            <div
                className={classNames(
                    `flex justify-center items-center w-10 h-10 rounded-full bg-${color}-600`,
                    {
                        'animate-pulse': !partOfSpeech,
                    },
                )}
            >
                <span className='font-bold text-lg text-white'>{short}</span>
            </div>
        </div>
    );
};
