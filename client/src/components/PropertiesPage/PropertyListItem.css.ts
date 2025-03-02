import { globalStyle, style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const item = style({
  backgroundColor: themeVars.color.background,
  display: 'flex',
  flexDirection: 'column',
  padding: 10,
  gap: 10,

  selectors: {
    '&.selected': {
      outline: `2px solid ${themeVars.color.text}`,
    },
    '&.selected.new': {
      outline: `2px dashed ${themeVars.color.text}`,
    },
    '&:not(.selected):not(.droppable):hover': {
      cursor: 'pointer',
      outline: `2px solid ${themeVars.color.backgroundLightest}`,
    },

    '&.droppable': {
      outline: `2px dashed ${themeVars.color.backgroundLightest}`,
    },

    '&.dragging': {
      outline: `2px dashed ${themeVars.color.backgroundLightest}`,
      backgroundColor: 'inherit',
    },
  },
});

globalStyle(`${item}.dragging > *`, {
  opacity: 0,
});

globalStyle(`${item}:not(.selected) *`, {
  pointerEvents: 'none',
});

export const main = style({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 0%',
  gap: 10,
});

export const section = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
});

export const button = style({
  selectors: {
    ['&.hidden']: {
      opacity: 0,
    },
  },
});

export const sidebar = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

globalStyle(`${section} > *:first-child`, {
  marginRight: 'auto',
});

globalStyle(`${section} input`, {
  textTransform: 'lowercase',
});

export const overlay = style([
  item,
  {
    boxSizing: 'border-box',
    position: 'fixed',
    pointerEvents: 'none',
    opacity: 0.5,
  },
]);
