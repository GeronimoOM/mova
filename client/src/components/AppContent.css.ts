import { style } from '@vanilla-extract/css';
import { breakpoints, themeVars } from '../index.css';

export const content = style({
  height: '100%',
  display: 'grid',
  gridTemplateRows: 'minmax(0, 1fr) auto',
  gridTemplateColumns: 'minmax(0, auto)',
  gridTemplateAreas: `
    "main"
    "nav"`,
  '@media': {
    [breakpoints.small]: {
      gridTemplateColumns: 'auto minmax(0, 1fr)',
      gridTemplateAreas: `"nav main"`,
    },
  },
});

export const loader = style({
  margin: 10,
  marginLeft: 0,
  backgroundColor: themeVars.color.backgroundLight,
});
