import { globalStyle, style } from '@vanilla-extract/css';
import { breakpoints } from '../../index.css';

export const nav = style({
  gridArea: 'nav',

  display: 'flex',
  flexDirection: 'row',
  padding: 10,
  gap: 10,

  '@media': {
    [breakpoints.small]: {
      flexDirection: 'column',
      gap: 20,
    },
  },
});

export const title = style({
  display: 'none',
  '@media': {
    [breakpoints.medium]: {
      display: 'flex',
    },
  },

  flexDirection: 'column',
  alignItems: 'stretch',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '1.5rem',
});

globalStyle(`${nav} > *:last-child`, {
  marginLeft: 'auto',

  '@media': {
    [breakpoints.small]: {
      marginLeft: 0,
      marginTop: 'auto',
    },
  },
});
