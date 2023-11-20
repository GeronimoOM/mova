import { Component, For, createEffect, createSignal } from 'solid-js';
import { createLazyQuery, createMutation } from '@merged/solid-apollo';
import {
  CreateWordDocument,
  DeleteWordDocument,
  GetPropertiesDocument,
  GetWordDocument,
  OptionPropertyFieldsFragment,
  OptionPropertyValueFieldsFragment,
  TextPropertyFieldsFragment,
  TextPropertyValueFieldsFragment,
  UpdatePropertyValueInput,
  UpdateWordDocument,
  WordFieldsFragment,
} from '../../api/types/graphql';
import { PropertyType } from '../../api/types/graphql';
import { createStore, reconcile } from 'solid-js/store';
import { useLanguageContext } from '../LanguageContext';
import {
  updateCacheOnCreateWord,
  updateCacheOnDeleteWord,
} from '../../api/mutations';
import { BsTranslate } from 'solid-icons/bs';
import { Icon } from '../common/Icon';
import {
  ColorContextType,
  ColorProvider,
  asClasses,
  useColorContext,
} from '../common/ColorContext';
import { ActionBar, Action } from '../common/ActionBar';
import { WordDetailsPosSelect } from './WordDetailsPosSelect';

const MIN_WORD_ORIGINAL_LENGTH = 1;
const MIN_WORD_TRANSLATION_LENGTH = 1;

export type WordDetailsProps = {
  selectedWordId: string | null;
  onWordSelect: (word: string | null) => void;
};

type WordProperty = TextWordProperty | OptionWordProperty;
type TextWordProperty = Partial<TextPropertyValueFieldsFragment> & {
  property: TextPropertyFieldsFragment;
};
type OptionWordProperty = Partial<OptionPropertyValueFieldsFragment> & {
  property: OptionPropertyFieldsFragment;
};

type WordState = Partial<
  WordFieldsFragment & {
    properties: WordProperty[];
  }
>;

export const WordDetails: Component<WordDetailsProps> = (props) => {
  const [selectedLanguageId] = useLanguageContext();

  const [selectedAction, setSelectedAction] = createSignal<Action | null>(null);
  const [word, setWord] = createStore<WordState>({});
  let updatedProperties: Record<string, UpdatePropertyValueInput> = {};

  const isSaveAction = () =>
    selectedAction() === Action.Create || selectedAction() === Action.Update;
  const isWordValid = () =>
    word.original &&
    word.original.trim().length >= MIN_WORD_ORIGINAL_LENGTH &&
    word.translation &&
    word.translation.trim().length >= MIN_WORD_TRANSLATION_LENGTH &&
    word.partOfSpeech;

  const [fetchSelectedWord, selectedWordQuery] =
    createLazyQuery(GetWordDocument);
  const [fetchProperties, propertiesQuery] = createLazyQuery(
    GetPropertiesDocument,
  );
  const [createWord, createdWordMutation] = createMutation(CreateWordDocument);
  const [updateWord] = createMutation(UpdateWordDocument);
  const [deleteWord] = createMutation(DeleteWordDocument);

  const selectedWord = () =>
    props.selectedWordId && selectedWordQuery.state === 'ready'
      ? selectedWordQuery()?.word
      : undefined;
  const properties = () =>
    propertiesQuery.state === 'ready'
      ? propertiesQuery()?.language?.properties
      : undefined;
  const createdWord = () => createdWordMutation()?.createWord;
  const isCreateMode = () => !props.selectedWordId;

  createEffect(() => {
    if (props.selectedWordId) {
      fetchSelectedWord({
        variables: {
          id: props.selectedWordId,
        },
      });
    }

    setWord(reconcile({}));
    updatedProperties = {};
  });

  createEffect(() => {
    if (isCreateMode()) {
      setSelectedAction(Action.Create);
    } else {
      setSelectedAction(null);
    }
  });

  createEffect(() => {
    if (selectedWord()) {
      const { partOfSpeech } = selectedWord()!;
      initWord();

      fetchProperties({
        variables: {
          languageId: selectedLanguageId()!,
          partOfSpeech,
        },
      });
    }
  });

  createEffect(() => {
    if (isCreateMode() && word.partOfSpeech) {
      fetchProperties({
        variables: {
          languageId: selectedLanguageId()!,
          partOfSpeech: word.partOfSpeech!,
        },
      });
    }
  });

  createEffect(() => {
    if (
      ((isCreateMode() && word.partOfSpeech) || selectedWord()) &&
      properties()
    ) {
      initWordProperties();
    }
  });

  const initWord = () => {
    const { original, translation, partOfSpeech } = selectedWord() ?? {};
    setWord(
      selectedWord() ? { original, translation, partOfSpeech } : reconcile({}),
    );
  };

  const initWordProperties = () => {
    setWord(
      'properties',
      (properties() ?? []).map((property) => {
        const propertyValue = selectedWord()?.properties.find(
          (propertyValue) => propertyValue.property.id === property.id,
        );
        return { ...propertyValue, property } as WordProperty;
      }),
    );

    updatedProperties = {};
  };

  const onWordPropertyChange = (wordProperty: WordProperty) => {
    const idx = word.properties!.findIndex(
      (wp) => wp.property.id === wordProperty.property.id,
    );
    setWord('properties', idx, {
      ...(wordProperty.property.type === PropertyType.Text && {
        text: (wordProperty as TextWordProperty).text,
      }),
      ...(wordProperty.property.type === PropertyType.Option && {
        option: (wordProperty as OptionWordProperty).option,
      }),
    });
    updatedProperties[wordProperty.property.id] = {
      id: wordProperty.property.id,
      ...(wordProperty.property.type === PropertyType.Text && {
        text: (wordProperty as TextWordProperty).text,
      }),
      ...(wordProperty.property.type === PropertyType.Option && {
        option: (wordProperty as OptionWordProperty).option?.id,
      }),
    };
  };

  const onActionSelect = async (newAction: Action | null) => {
    if (newAction === selectedAction()) {
      if (newAction) {
        executeAction(newAction);
      } else {
        props.onWordSelect(null);
      }
    } else {
      if (!newAction) {
        if (selectedAction() === Action.Create) {
          props.onWordSelect(null);
        } else {
          initWord();
          initWordProperties();
        }
      }
      setSelectedAction(newAction);
    }
  };

  const executeAction = (action: Action) => {
    switch (action) {
      case Action.Create:
        return executeCreate();
      case Action.Update:
        return executeUpdate();
      case Action.Delete:
        return executeDelete();
    }
  };

  const executeCreate = async () => {
    await createWord({
      variables: {
        input: {
          languageId: selectedLanguageId()!,
          original: word.original!.trim(),
          translation: word.translation!.trim(),
          partOfSpeech: word.partOfSpeech!,
          properties: Object.values(updatedProperties).map((value) => ({
            ...value,
            text: value.text?.trim(),
          })),
        },
      },
      update: updateCacheOnCreateWord,
    });

    setSelectedAction(null);
    props.onWordSelect(createdWord()!.id);
  };

  const executeUpdate = async () => {
    await updateWord({
      variables: {
        input: {
          id: props.selectedWordId!,
          original: word.original!.trim(),
          translation: word.translation!.trim(),
          properties: Object.values(updatedProperties).map((value) => ({
            ...value,
            text: value.text?.trim(),
          })),
        },
      },
    });

    setSelectedAction(null);
  };

  const executeDelete = async () => {
    await deleteWord({
      variables: {
        id: props.selectedWordId!,
      },
      update: updateCacheOnDeleteWord,
    });

    setSelectedAction(null);
    props.onWordSelect(null);
  };

  const colorContext: ColorContextType = {
    base: {
      textColor: 'text-gray-100',
      backgroundColor: 'bg-spacecadet-300',
      hoverTextColor: 'hover:text-gray-100',
      hoverBackgroundColor: 'hover:bg-spacecadet-100',
    },
    active: {
      backgroundColor: 'bg-spacecadet-200',
    },
    selected: {
      textColor: 'text-gray-100',
      backgroundColor: 'bg-spacecadet-200',
      hoverTextColor: 'hover:text-spacecadet-300',
    },
    disabled: {
      textColor: 'text-gray-500',
    },
  };

  return (
    <ColorProvider colorContext={colorContext}>
      <div class="h-full w-full p-2">
        <div
          class={`flex h-fit min-h-full flex-col gap-y-3 p-5
        ${colorContext.base!.textColor} ${colorContext.base!.backgroundColor}`}
        >
          <div class="flex flex-row items-center justify-between">
            <WordDetailsPosSelect
              selectedPartOfSpeech={word.partOfSpeech ?? null}
              onPartOfSpeechSelect={(partOfSpeech) => setWord({ partOfSpeech })}
              isDisabled={!isCreateMode()}
            />
            <ActionBar
              actions={
                isCreateMode()
                  ? [Action.Create, null]
                  : [Action.Update, Action.Delete, null]
              }
              selectedAction={selectedAction()}
              onActionSelect={onActionSelect}
              isSaveDisabled={!isWordValid()}
            />
          </div>

          <div class="flex flex-row items-center">
            <WordDetailsTextInput
              text={word.original ?? ''}
              onTextChange={(original) => setWord({ original })}
              size="lg"
              isDisabled={!isSaveAction()}
            />
          </div>
          <div class="flex flex-row items-center">
            <Icon
              icon={BsTranslate}
              size="sm"
              class="p-1.5 text-coolgray-300"
            />
            <WordDetailsTextInput
              text={word.translation ?? ''}
              onTextChange={(translation) => setWord({ translation })}
              isDisabled={!isSaveAction()}
            />
          </div>
          <For each={word.properties}>
            {(property) => (
              <WordDetailsProperty
                wordProperty={property}
                onWordPropertyChange={onWordPropertyChange}
                isDisabled={!isSaveAction()}
              />
            )}
          </For>
        </div>
      </div>
    </ColorProvider>
  );
};

type WordDetailsPropertyProps = {
  wordProperty: WordProperty;
  onWordPropertyChange: (wordProperty: WordProperty) => void;
  isDisabled?: boolean;
};

const WordDetailsProperty: Component<WordDetailsPropertyProps> = (props) => {
  // TODO option property
  if (props.wordProperty.property.type === PropertyType.Option) {
    return null;
  }

  return (
    <div class="flex flex-col">
      <p class="p-1 text-sm text-coolgray-300">
        {props.wordProperty.property.name}
      </p>
      <WordDetailsTextInput
        text={(props.wordProperty as TextWordProperty).text ?? ''}
        onTextChange={(text) =>
          props.onWordPropertyChange({
            property: props.wordProperty.property,
            text,
          } as TextWordProperty)
        }
        isDisabled={props.isDisabled}
      />
    </div>
  );
};

type WordDetailsTextInputProps = {
  text: string;
  onTextChange: (text: string) => void;
  size?: 'lg' | 'md';
  isDisabled?: boolean;
};

const WordDetailsTextInput: Component<WordDetailsTextInputProps> = (props) => {
  const { base: baseColors, active: activeColors } = useColorContext()!;
  const disabledClasses = asClasses(baseColors?.backgroundColor);
  const enabledClasses = asClasses(activeColors?.backgroundColor);

  return (
    <input
      class="w-full p-3 outline-none"
      classList={{
        [disabledClasses]: props.isDisabled,
        [enabledClasses]: !props.isDisabled,
        'text-lg': props.size === 'lg',
      }}
      value={props.text}
      onInput={(e) => props.onTextChange(e.currentTarget.value)}
      disabled={props.isDisabled}
      spellcheck={false}
      autoCapitalize="off"
    />
  );
};
