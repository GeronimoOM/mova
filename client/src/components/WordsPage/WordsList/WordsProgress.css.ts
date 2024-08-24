import { globalStyle, style } from '@vanilla-extract/css';
import { themeVars } from '../../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  gap: 10,
});

globalStyle(`${wrapper} > svg`, {
  padding: 10,
  color: themeVars.color.secondary2,
});

export const bar = style({
  flex: 1,
});

export const label = style({
  textAlign: 'right',
  marginLeft: 'auto',
  minWidth: '3.5rem',
});
