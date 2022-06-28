import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { WordList } from '../components/WordList';
import { Word, words } from '../data/words';

const meta: ComponentMeta<typeof WordList> = {
    title: 'WordList',
    component: WordList,
    argTypes: { onSelect: { action: 'selected' } },
};

export default meta;

const Template: ComponentStory<typeof WordList> = (args) => {
    const { selected: initialSelected, onSelect, ...otherArgs } = args;
    const [selected, setSelected] = useState<Word | null>(initialSelected);

    return (
        <WordList
            {...otherArgs}
            selected={selected}
            onSelect={(word) => {
                onSelect(word);
                setSelected(word);
            }}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    words,
};

export const Selected = Template.bind({});
Selected.args = {
    words,
    selected: words[1],
};

export const Empty = Template.bind({});
Empty.args = {
    words: [],
};

export const Loading = Template.bind({});
Loading.args = {
    words: [],
    isLoading: true,
};
