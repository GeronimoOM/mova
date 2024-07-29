import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const wrapper = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
});

export const list = style({
  overflowY: 'scroll',
  display: 'flex',
  flexDirection: 'column',
  padding: 10,
  gap: 10,
  borderTop: `2px solid ${themeVars.color.backgroundLight}`,
  borderBottom: `2px solid ${themeVars.color.backgroundLight}`,
});

export const listEnd = style({
  minHeight: 50,
});

export const buttons = style({
  position: 'absolute',
  bottom: 10,
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const buttonWrapper = style({
  border: `2px solid ${themeVars.color.text}`,
  backgroundColor: themeVars.color.background,
  padding: 5,
  borderRadius: 30,
});
