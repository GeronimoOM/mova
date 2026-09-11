import { globalStyle, style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const wrapper = style({
  backgroundColor: themeVars.color.background,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  minHeight: 0,
});

export const exercise = style({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 500,
  flex: 1,
  overflowY: 'auto',
  minHeight: 0,
  padding: 10,
});

export const buttons = style({
  display: 'flex',
  flexDirection: 'row',
  padding: 10,
  gap: 20,
  boxSizing: 'border-box',
  width: '100%',
  flex: 0,
});

globalStyle(`${buttons} > *:last-child`, {
  marginLeft: 'auto',
});

export const details = style({
  position: 'absolute',
  zIndex: 1,
  top: 5,
  right: 5,
  left: 5,
  bottom: 65,
  outline: `2px solid ${themeVars.color.backgroundLightest}`,
  backgroundColor: themeVars.color.background,
});

export const centered = style({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
});

export const noWordsTitle = style({
  color: themeVars.color.text,
  textAlign: 'center',
});

export const noWordsDescription = style({
  color: themeVars.color.muted,
  textAlign: 'center',
});

export const exercisesReady = style({
  display: 'flex',
  alignItems: 'center',
  gap: 5,
});

export const exercisesReadyNumber = style({
  color: themeVars.color.secondary1,
  fontWeight: 'bold',
});
