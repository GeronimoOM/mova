import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from '../components/Button';

const meta: ComponentMeta<typeof Button> = {
    title: 'Button',
    component: Button,
    argTypes: { onClick: { action: 'clicked' } },
};

export default meta;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
    text: 'Save',
};
