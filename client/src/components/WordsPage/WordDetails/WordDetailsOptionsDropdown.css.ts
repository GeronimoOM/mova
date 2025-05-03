import { style } from '@vanilla-extract/css';
import { themeVars } from '../../../index.css';

export const wrapper = style({
  padding: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

export const options = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
});

export const rawOption = style({
  borderTop: `1px solid ${themeVars.color.backgroundLighter}`,
  paddingTop: 10,
  display: 'flex',
  flexDirection: 'row',
  gap: 10,
});
