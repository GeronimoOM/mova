import { globalStyle, style } from '@vanilla-extract/css';
import { themeVars } from '../../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: themeVars.color.background,
  position: 'relative',
  paddingBottom: 10,
  gap: 10,
});

export const iconLeft = style({
  position: 'absolute',
  left: 10,
  top: 0,
  bottom: 10,
  marginTop: 'auto',
  marginBottom: 'auto',
  display: 'flex',
  alignItems: 'center',
  color: themeVars.color.muted,
});

globalStyle(`${wrapper} > input`, {
  flex: '1 1 0%',
});

globalStyle(`${wrapper}.highlighted > input`, {
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
