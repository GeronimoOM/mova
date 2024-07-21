import { style } from '@vanilla-extract/css';
import { themeVars } from '../../../index.css';

export const list = style({
  height: '100%',
  overflowY: 'scroll',
  overflowX: 'hidden',

  display: 'grid',
  gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 4fr)',
  gridAutoRows: 'min-content',
  alignItems: 'center',

  backgroundColor: themeVars.color.backgroundLight,
});

export const listEnd = style({
  height: 20,
});
