import classNames from 'classnames';
import React from 'react';
import { PartOfSpeech } from '../types';

export interface PartOfSpechBadgeConfig {
    short: string;
    color: string;
}

export const partsOfSpeechConfig: Record<PartOfSpeech, PartOfSpechBadgeConfig> = {
    [PartOfSpeech.Noun]: {
        short: 'N',
        color: 'orange',
    },
    [PartOfSpeech.Verb]: {
        short: 'V',
        color: 'sky',
    },
    [PartOfSpeech.Adjective]: {
        short: 'Adj',
        color: 'yellow',
    },
    [PartOfSpeech.Adverb]: {
        short: 'Adv',
        color: 'teal',
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

interface PartOfSpeechBadgeProps {
    partOfSpeech: PartOfSpeech | null;
    onClick?: () => void;
    isDisabled?: boolean;
    size: 'small' | 'large';
}

export const PartOfSpeechBadge: React.FC<PartOfSpeechBadgeProps> = ({
    partOfSpeech,
    onClick,
    isDisabled,
    size,
}) => {
    const { short, color } = partOfSpeech
        ? partsOfSpeechConfig[partOfSpeech]
        : unknownPartOfSpeechBadgeConfig;
    const isSmall = size === 'small';

    return (
        <div
            className={classNames('p-1.5', {
                [`hover:bg-${color}-500 cursor-pointer`]: !isDisabled,
            })}
            onClick={onClick}
        >
            <div
                className={classNames(
                    `flex justify-center items-center rounded-full bg-${color}-500`,
                    {
                        'w-8 h-8': isSmall,
                        'w-10 h-10': !isSmall,
                        'animate-pulse': !partOfSpeech,
                    },
                )}
            >
                <span className={classNames('font-bold text-white', {
                    'text-sm': isSmall,
                    'text-lg': !isSmall,
                })}>{short}</span>
            </div>
        </div>
    );
};