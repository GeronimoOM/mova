import { style } from '@vanilla-extract/css';
import { breakpoints } from '../index.css';

export const main = style({
  gridArea: 'main',
  padding: 10,
  paddingBottom: 0,
  '@media': {
    [breakpoints.small]: {
      paddingBottom: 10,
      paddingLeft: 0,
    },
  },
});
