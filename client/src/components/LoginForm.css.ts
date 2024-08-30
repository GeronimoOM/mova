import { style } from '@vanilla-extract/css';
import { theme, themeVars } from '../index.css';

export const wrapper = style([
  theme,
  {
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: 900,
    margin: '0 auto',
    height: '100%',
    color: themeVars.color.text,
    backgroundColor: themeVars.color.background,
  },
]);

export const form = style({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 300,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: 100,
  gap: 10,
});

export const label = style({
  color: themeVars.color.muted,
  fontWeight: 'bold',
});

export const button = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: 10,
});
