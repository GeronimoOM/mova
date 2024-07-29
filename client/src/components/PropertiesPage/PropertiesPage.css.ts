import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const wrapper = style({
  height: '100%',
  display: 'grid',
  gridTemplateRows: 'auto minmax(0, 1fr)',
  gridTemplateColumns: 'minmax(0, auto)',
  backgroundColor: themeVars.color.backgroundLight,
});

export const header = style({});
