import React, { ReactNode, useEffect, useState } from 'react';
import { FaGlobe, FaThList } from 'react-icons/fa';
import { IoSettings, IoRadioButtonOff, IoRadioButtonOn } from 'react-icons/io5';
import {
    BsFillPlusCircleFill,
    BsFillPencilFill,
    BsFillCaretRightFill,
    BsFillCaretLeftFill,
} from 'react-icons/bs';
import classNames from 'classnames';
import { useAppDispatch, useLanguages, useSelectedLanguage } from '../store';
import { fetchLanguages, setSelectedLanguage } from '../store/languages';
import { IconType } from 'react-icons';
import { fetchProperties } from '../store/properties';

export interface NavBarProps {
    selectedTab: NavBarTab;
    onSelectedTab: (tab: NavBarTab) => void;
}

export type NavBarTab = 'dictionary' | 'settings';

export const NavBar: React.FC<NavBarProps> = ({
    selectedTab,
    onSelectedTab,
}) => {
    const languages = useLanguages();
    const selectedLanguage = useSelectedLanguage();
    const dispatch = useAppDispatch();

    const [isLanguagesListOpen, setLanguagesListOpen] = useState(false);
    const [createLanguageName, setCreateLanguageName] = useState('');

    useEffect(() => {
        dispatch(fetchLanguages());
    }, [dispatch]);

    useEffect(() => {
        if (selectedLanguage) {
            dispatch(fetchProperties({ languageId: selectedLanguage.id }));
        }
    }, [dispatch, selectedLanguage]);

    const handleSelectLanguage = (language: string) => {
        if (selectedLanguage?.id !== language) {
            dispatch(setSelectedLanguage(language));
        }
    }

    return (
        <aside className='flex-none w-[15rem] overflow-x-hidden bg-gray-700'>
            <div
                className={classNames(
                    'flex flex-no-wrap transition-transform',
                    {
                        'translate-x-[-15rem]': isLanguagesListOpen,
                    },
                )}
            >
                <div className='min-w-[15rem] h-full'>
                    <ul className='space-y-1'>
                        <NavBarItem
                            leftIcon={FaGlobe}
                            title={
                                selectedLanguage
                                    ? selectedLanguage.name
                                    : 'Language'
                            }
                            rightIcon={BsFillCaretRightFill}
                            onClick={() =>
                                setLanguagesListOpen(!isLanguagesListOpen)
                            }
                        ></NavBarItem>
                        <NavBarItem
                            leftIcon={FaThList}
                            title={'Dictionary'}
                            isActive={selectedTab === 'dictionary'}
                            onClick={() => onSelectedTab('dictionary')}
                        />
                        <NavBarItem
                            leftIcon={IoSettings}
                            title={'Settings'}
                            isActive={selectedTab === 'settings'}
                            onClick={() => onSelectedTab('settings')}
                        />
                    </ul>
                </div>
                <div className='min-w-[15rem]'>
                    <ul>
                        <NavBarItem
                            leftIcon={BsFillCaretLeftFill}
                            title=''
                            onClick={() => setLanguagesListOpen(false)}
                        />
                        {languages.map((language) => (
                            <NavBarItem
                                key={language.id}
                                title={language.name}
                                leftIcon={
                                    selectedLanguage?.id === language.id
                                        ? IoRadioButtonOn
                                        : IoRadioButtonOff
                                }
                                rightIcon={BsFillPencilFill}
                                isEditable={true}
                                hideRightIcon={true}
                                onClick={() => handleSelectLanguage(language.id)}
                            />
                        ))}
                        <NavBarItem
                            rightIcon={BsFillPlusCircleFill}
                            title={createLanguageName}
                        />
                    </ul>
                </div>
            </div>
        </aside>
    );
};

export interface NavBarItemProps {
    leftIcon?: IconType;
    rightIcon?: IconType;
    hideRightIcon?: boolean;
    title: string;
    isEditable?: boolean;
    isActive?: boolean;
    onClick?: () => void;
    children?: ReactNode;
}

export const NavBarItem: React.FC<NavBarItemProps> = ({
    leftIcon,
    rightIcon,
    hideRightIcon,
    title,
    isEditable,
    isActive,
    onClick,
    children,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    return (
        <li>
            <div
                className='flex flex-row items-center hover:bg-gray-600 p-2 text-white text-lg font-bold group'
                onClick={onClick}
            >
                {leftIcon && leftIcon({ className: 'w-6 h-6 flex-none' })}
                <input
                    type='text'
                    value={title}
                    className={classNames(
                        'flex-1 px-2 w-full bg-inherit border-none outline-none',
                        {
                            // 'ml-6': !leftIcon,
                            // 'mr-6': !rightIcon,
                        },
                    )}
                    disabled={!isEditing}
                />
                {rightIcon &&
                    rightIcon({
                        className: classNames(
                            'w-6 h-6 flex-none group-hover:scale-100',
                            {
                                'scale-0 transition': hideRightIcon,
                                'scale-100': isEditing,
                            },
                        ),
                        onClick: () => isEditable && setIsEditing(!isEditing),
                    })}
            </div>
            {children}
        </li>
    );
};
