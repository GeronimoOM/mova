import { style } from '@vanilla-extract/css';
import { themeVars } from '../../../index.css';

export const progress = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  color: themeVars.color.secondary1,
});
