import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 15,
});

export const title = style({
  padding: 5,
  textAlign: 'center',
  color: themeVars.color.muted,
  fontWeight: 'bold',
});

export const translation = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
});

export const translationLabel = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 5,
  color: themeVars.color.muted,
  fontWeight: 'bold',
});

export const translationRow = style({
  display: 'flex',
  flexDirection: 'row',
  gap: 10,
});

export const result = style({
  marginTop: 10,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  gap: 20,
  padding: 10,
});
