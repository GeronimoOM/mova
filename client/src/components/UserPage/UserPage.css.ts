import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 10,
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: themeVars.color.backgroundLight,
});

export const card = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  gap: 10,
  backgroundColor: themeVars.color.background,
});
