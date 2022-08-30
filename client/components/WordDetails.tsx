import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { BsFillTrashFill, BsFillXCircleFill } from 'react-icons/bs';
import {
    useAppDispatch,
    useSelectedLanguage,
    useProperties,
    useIsWordCreating,
} from '../store';
import { createWord, deleteWord, updateWord } from '../store/words';
import {
    CreateWordInput,
    PartOfSpeech,
    Property,
    PropertyValue,
    TextProperty,
    TextPropertyValue,
    UpdateWordInput,
    Word,
} from '../types';
import { PartOfSpeechSelect } from './PartOfSpeechSelect';

export interface WordDetailsProps {
    word: Word | null;
    isOpen: boolean;
    onClose: () => void;
}

export const WordDetails: React.FC<WordDetailsProps> = ({
    word,
    isOpen,
    onClose,
}) => {
    const selectedLanguage = useSelectedLanguage();
    const dispatch = useAppDispatch();

    const isCreateMode = !word;
    const isCreating = useIsWordCreating();

    const [wordDraft, setWordDraft] = useState<Partial<Word>>(word ?? {});
    let properties = useProperties(wordDraft.partOfSpeech);
    properties = isCreateMode && !wordDraft.partOfSpeech ? [] : properties;

    const propertiesWithDraftValues: Array<[Property, PropertyValue | null]> =
        properties.map((property) => [
            property,
            wordDraft?.properties?.find(
                (propertyValue) => propertyValue.property.id === property.id,
            ) ?? null,
        ]);

    const [isPartOfSpeechSelectOpen, setPartOfSpeechSelectOpen] =
        useState(false);

    useEffect(() => {
        setWordDraft(word ?? {});
        setPartOfSpeechSelectOpen(false);
    }, [word]);

    useEffect(() => {
        if (isOpen && isCreateMode) {
            setWordDraft({});
            setPartOfSpeechSelectOpen(false);
        }
    }, [isOpen]);

    const saveChangesTimeout = useRef<NodeJS.Timeout>();
    const handleWordChange = (word: Partial<Word>) => {
        setWordDraft(word);

        clearTimeout(saveChangesTimeout.current);

        if (isCreateMode) {
            if (isCreating) {
                return;
            }

            const createWordInput = wordDraftToCreateWordInput(
                word,
                selectedLanguage!.id,
            );
            if (createWordInput) {
                saveChangesTimeout.current = setTimeout(
                    () => dispatch(createWord(createWordInput)),
                    1000,
                );
            }
        } else {
            const updateWordInput = wordDraftToUpdateWordInput(word);
            if (updateWordInput) {
                saveChangesTimeout.current = setTimeout(
                    //todo validate word
                    () => dispatch(updateWord(updateWordInput)),
                    1000,
                );
            }
        }
    };

    const handleDelete = () => {
        dispatch(deleteWord(word!.id));
    };

    const handleOriginalChange = (original: string) => {
        handleWordChange({ ...wordDraft!, original });
    };

    const handleTranslationChange = (translation: string) => {
        handleWordChange({ ...wordDraft!, translation });
    };

    const handlePropertyValueChange = (propertyValue: PropertyValue) => {
        handleWordChange({
            ...wordDraft!,
            properties: [
                ...(wordDraft?.properties?.filter(
                    (value) => value.property.id !== propertyValue.property.id,
                ) ?? []),
                propertyValue,
            ],
        });
    };

    const handlePartOfSpeechChange = (partOfSpeech: PartOfSpeech) => {
        setWordDraft({ ...wordDraft!, partOfSpeech });
        setPartOfSpeechSelectOpen(false);
    };

    return (
        <aside
            className={classNames(
                'fixed right-0 z-10 w-[18rem] lg:w-[24rem] xl:w-[30rem] 2xl:w-[36em] h-full bg-gray-700 transition-all',
                {
                    'translate-x-[18rem] lg:translate-x-[24rem] xl:translate-x-[30rem] 2xl:translate-x-[36em]':
                        !isOpen,
                },
            )}
        >
            <div className='h-full flex flex-col items-stretch p-6 space-y-6'>
                <div className='flex flex-row items-center space-x-2'>
                    <PartOfSpeechSelect
                        selected={wordDraft.partOfSpeech ?? null}
                        onSelect={handlePartOfSpeechChange}
                        isOpen={isPartOfSpeechSelectOpen}
                        onOpen={(isOpen) =>
                            isCreateMode && setPartOfSpeechSelectOpen(isOpen)
                        }
                        isDisabled={!isCreateMode}
                    />
                    <input
                        type='text'
                        value={wordDraft.original ?? ''}
                        onChange={(event) =>
                            handleOriginalChange(event.target.value)
                        }
                        className={classNames(
                            'flex-1 text-3xl w-full p-2 text-white font-bold font-mono tracking-wide',
                            'outline-none bg-gray-600 focus:bg-gray-500 rounded',
                            {
                                'animate-pulse':
                                    isCreateMode && !wordDraft.original,
                            },
                        )}
                        spellCheck={false}
                    ></input>
                </div>
                <div>
                    <input
                        type='text'
                        value={wordDraft.translation ?? ''}
                        onChange={(event) =>
                            handleTranslationChange(event.target.value)
                        }
                        className={classNames(
                            'text-xl italic w-full p-2 mb-3 text-white font-bold',
                            'outline-none bg-gray-600 focus:bg-gray-500 rounded',
                            {
                                'animate-pulse':
                                    isCreateMode && !wordDraft.translation,
                            },
                        )}
                        spellCheck={false}
                    ></input>
                </div>
                {propertiesWithDraftValues.map(([property, propertyValue]) => (
                    <WordDetailsProperty
                        key={property.id}
                        property={property}
                        propertyValue={propertyValue}
                        onPropertyValueUpdate={(propertyValue) =>
                            handlePropertyValueChange(propertyValue)
                        }
                    />
                ))}
                  <div className='flex flex-row mt-auto'>
                    <BsFillXCircleFill
                        className='w-6 h-6 text-white'
                        onClick={onClose}
                    />

                    {!isCreateMode && (
                        <BsFillTrashFill
                            className='w-6 h-6 text-white'
                            onClick={handleDelete}
                        />
                    )}
                </div>
            </div>
        </aside>
    );
};

const wordDraftToCreateWordInput = (
    word: Partial<Word>,
    languageId: string,
): CreateWordInput | null => {
    if (!word.partOfSpeech || !word.original || !word.translation) {
        return null;
    }

    return {
        original: word.original.trim(),
        translation: word.translation.trim(),
        partOfSpeech: word.partOfSpeech,
        languageId,
        properties: word?.properties?.map((propertyValue) => ({
            id: propertyValue.property.id,
            text: (propertyValue as TextPropertyValue).text.trim(),
        })),
    };
};

const wordDraftToUpdateWordInput = (
    word: Partial<Word>,
): UpdateWordInput | null => {
    if (!word.id || !word.original || !word.translation) {
        return null;
    }

    return {
        id: word.id,
        original: word.original.trim(),
        translation: word.translation.trim(),
        properties: word?.properties?.map((propertyValue) => ({
            id: propertyValue.property.id,
            text: (propertyValue as TextPropertyValue).text.trim(),
        })),
    };
};

interface WordDetailsPropertyProps {
    property: Property;
    propertyValue: PropertyValue | null;
    onPropertyValueUpdate: (value: PropertyValue) => void;
}

const WordDetailsProperty: React.FC<WordDetailsPropertyProps> = ({
    property,
    propertyValue,
    onPropertyValueUpdate,
}) => {
    //TODO Option
    return (
        <div>
            <label className='font-bold text-gray-400'>{property.name}</label>
            <input
                type='text'
                value={(propertyValue as TextPropertyValue)?.text ?? ''}
                onChange={(event) =>
                    onPropertyValueUpdate({
                        property: property as TextProperty,
                        text: event.target.value,
                    })
                }
                className='text-xl w-full p-2 text-white font-bold
                outline-none bg-gray-600 focus:bg-gray-500 rounded'
                spellCheck={false}
            ></input>
        </div>
    );
};
