import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
  paddingTop: 20,
  padding: 10,
  backgroundColor: themeVars.color.backgroundLight,
});
