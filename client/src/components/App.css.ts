import { style } from '@vanilla-extract/css';
import { fontThemeVars, themeVars } from '../index.css';

export const app = style({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 900,
  margin: '0 auto',
  height: '100%',

  fontFamily: fontThemeVars.baseFont,
  color: themeVars.color.text,
  backgroundColor: themeVars.color.background,
});
