import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const card = style({
  padding: 10,
  backgroundColor: themeVars.color.background,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

export const centered = style({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});
