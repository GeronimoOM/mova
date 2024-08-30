import { style } from '@vanilla-extract/css';
import { themeVars } from '../../../index.css';

export const wrapper = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
});

export const list = style({
  overflowY: 'scroll',

  display: 'grid',
  gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 4fr)',
  gridAutoRows: 'min-content',
  alignItems: 'center',

  backgroundColor: themeVars.color.backgroundLight,
});

export const listEnd = style({
  height: 20,
});

export const buttons = style({
  position: 'absolute',
  bottom: 10,
  right: 10,
});
