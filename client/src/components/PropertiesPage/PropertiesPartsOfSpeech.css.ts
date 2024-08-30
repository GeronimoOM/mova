import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const wrapper = style({
  backgroundColor: themeVars.color.background,
  paddingTop: 10,
  paddingBottom: 20,
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  placeContent: 'center',
  alignItems: 'center',
  gap: 5,
});

export const item = style({
  cursor: 'pointer',
});
