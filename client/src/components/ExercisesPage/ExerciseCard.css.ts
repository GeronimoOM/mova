import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const card = style({
  padding: 10,
  backgroundColor: themeVars.color.background,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
});

export const exercise = style({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 500,
});

export const details = style({
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  bottom: 60,
  outline: `2px solid ${themeVars.color.muted}`,
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
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  width: '100%',
});
