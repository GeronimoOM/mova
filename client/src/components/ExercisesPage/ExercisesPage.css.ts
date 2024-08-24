import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const wrapper = style({
  height: '100%',
  backgroundColor: themeVars.color.backgroundLight,
  padding: 10,
  gap: 10,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
});
