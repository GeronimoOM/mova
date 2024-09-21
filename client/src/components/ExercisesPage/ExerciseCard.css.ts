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
  zIndex: 1,
  top: 5,
  right: 5,
  left: 5,
  bottom: 60,
  outline: `2px solid ${themeVars.color.backgroundLightest}`,
  backgroundColor: themeVars.color.background,
});

export const centered = style({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export const noWordsTitle = style({
  color: themeVars.color.text,
  textAlign: 'center',
});

export const noWordsDescription = style({
  color: themeVars.color.muted,
  textAlign: 'center',
});

export const bottom = style({
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  width: '100%',
});
