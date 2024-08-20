import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const wrapper = style({
  height: '100%',
  position: 'relative',
});

export const list = style({
  height: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'scroll',
  padding: 10,
  gap: 10,
  backgroundColor: themeVars.color.backgroundLight,
  borderTop: `2px solid ${themeVars.color.backgroundLight}`,
  borderBottom: `2px solid ${themeVars.color.backgroundLight}`,
});

export const listEnd = style({
  minHeight: 50,
});

export const buttons = style({
  position: 'absolute',
  bottom: 10,
  right: 10,
});
