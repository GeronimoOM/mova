import { globalStyle, style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const card = style({
  display: 'flex',
  flexDirection: 'row',
  justifyItems: 'stretch',
  padding: 10,
  gap: 10,
  backgroundColor: themeVars.color.background,
  minHeight: 200,

  selectors: {
    '&.selected': {
      outline: `2px solid ${themeVars.color.primary}`,
    },
  },
});

export const main = style({
  display: 'flex',
  flexDirection: 'row',
  flex: '1 1 0%',
});

export const buttons = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

globalStyle(`${buttons} > *:last-child`, {
  marginTop: 'auto',
});

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

export const deleteConfirmLanguage = style({
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
