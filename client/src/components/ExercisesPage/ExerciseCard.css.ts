import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const card = style({
  padding: 10,
  backgroundColor: themeVars.color.background,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const exercise = style({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 500,
});

export const centered = style({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export const bottom = style({
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'end',
  boxSizing: 'border-box',
  width: '100%',
});
