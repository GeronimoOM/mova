import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 10,
  gap: 10,
  overflowY: 'auto',
});

export const card = style({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 500,
  display: 'flex',
  flexDirection: 'column',
  padding: '0 10px',
  fontWeight: 'bold',
  color: themeVars.color.muted,
  backgroundColor: themeVars.color.background,
});

export const cardRow = style({
  display: 'flex',
  alignItems: 'center',
  padding: 10,
  gap: 20,
});

export const number = style({
  color: themeVars.color.text,
  marginLeft: 'auto',
});

export const legend = style({
  flex: 1,
  maxWidth: 200,
  marginLeft: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
});

export const legendRow = style({
  display: 'flex',
  gap: 5,
  alignItems: 'center',
});

export const legendIcon = style({
  width: 10,
  height: 10,
  borderRadius: '50%',
});
