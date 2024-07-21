import { globalStyle, style } from '@vanilla-extract/css';
import { themeVars } from '../../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: themeVars.color.background,
  position: 'relative',
  padding: '10px 0',
  gap: 10,
});

export const icon = style({
  position: 'absolute',
  left: 10,
  top: 0,
  bottom: 0,
  marginTop: 'auto',
  marginBottom: 'auto',
  display: 'flex',
  alignItems: 'center',
  color: themeVars.color.muted,
});

globalStyle(`${wrapper} input`, {
  flex: '1 1 0%',
});
