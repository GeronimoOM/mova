import { globalStyle, style } from '@vanilla-extract/css';
import { themeVars } from '../../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: themeVars.color.background,
  paddingBottom: 10,
  gap: 10,
});

globalStyle(`${wrapper}.highlighted input`, {
  outline: `2px solid ${themeVars.color.text}`,
});

export const buttonRight = style({
  position: 'absolute',
  right: 5,
  top: 0,
  bottom: 10,
  marginTop: 'auto',
  marginBottom: 'auto',
  display: 'flex',
  alignItems: 'center',
});
