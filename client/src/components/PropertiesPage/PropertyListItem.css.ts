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

export const header = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
});

export const content = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
});

export const typeIcon = style({
  display: 'flex',
  flexDirection: 'row',
  gap: 5,
  padding: 5,
  color: themeVars.color.muted,
});

export const button = style({
  selectors: {
    ['&.hidden']: {
      opacity: 0,
    },
  },
});

export const typeLabel = style({
  textTransform: 'lowercase',
});

export const sidebar = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

globalStyle(`${header} > *:first-child`, {
  marginRight: 'auto',
});

globalStyle(`${content} input`, {
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

export const deleteConfirm = style({
  minWidth: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 10,
  gap: 30,
});

export const deleteConfirmText = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 10,
});

export const deleteConfirmProperty = style({
  textTransform: 'lowercase',
  fontSize: '1.25rem',
  padding: '5px 10px',
  borderRadius: 5,
  backgroundColor: themeVars.color.backgroundLighter,
});

export const deleteConfirmButtons = style({
  display: 'flex',
  flexDirection: 'row',
  gap: 10,
});
