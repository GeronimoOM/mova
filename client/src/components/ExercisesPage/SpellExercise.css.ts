import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

export const title = style({
  margin: 10,
  textAlign: 'center',
  color: themeVars.color.muted,
  fontWeight: 'bold',
});

export const propertyLabel = style({
  marginTop: 20,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 5,
  color: themeVars.color.muted,
  fontWeight: 'bold',
  textTransform: 'lowercase',
});

export const propertyLabelDivider = style({
  margin: '0 5px',
});

export const result = style({
  marginTop: 20,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  gap: 20,
  padding: 10,
});
