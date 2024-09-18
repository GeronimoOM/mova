import { globalStyle, style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxSizing: 'border-box',
  height: '100%',
  padding: 10,
  backgroundColor: themeVars.color.backgroundLight,
});

export const content = style({
  flex: 1,
  width: '100%',
  maxWidth: 500,
  display: 'flex',
  flexDirection: 'column',
  gap: 15,
});

export const card = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px 10px',
  gap: 10,
  backgroundColor: themeVars.color.background,
});

globalStyle(`${content} > ${card}:last-child`, {
  marginTop: 'auto',
});

export const flag = style({
  display: 'flex',
  width: '2.5rem',
  height: '2.5rem',
  padding: 3,
  border: `3px solid transparent`,
  borderRadius: '100%',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease, border 0.2s ease',

  selectors: {
    '&:hover, &.selected': {
      border: `3px solid ${themeVars.color.primary}`,
      backgroundColor: themeVars.color.backgroundLighter,
    },
  },
});

globalStyle(`${flag} svg`, {
  borderRadius: '100%',
  border: `2px solid ${themeVars.color.text}`,
});
