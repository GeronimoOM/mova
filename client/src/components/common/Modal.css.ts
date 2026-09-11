import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const backdrop = style({
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  backdropFilter: 'blur(2px)',
});

export const modalWrapper = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 51,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const modal = style({
  border: `2px solid ${themeVars.color.text}`,
  borderRadius: 4,
  backgroundColor: `${themeVars.color.background}`,
});
