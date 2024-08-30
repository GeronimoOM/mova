import { style } from '@vanilla-extract/css';
import { breakpoints, theme, themeVars } from '../index.css';

export const app = style([
  theme,
  {
    maxWidth: 900,
    height: '100%',
    margin: '0 auto',
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

    color: themeVars.color.text,
    backgroundColor: themeVars.color.background,
  },
]);
