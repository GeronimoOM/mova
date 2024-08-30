import { style } from '@vanilla-extract/css';
import { breakpoints, themeVars } from '../../index.css';

export const link = style({
  color: 'inherit',
  textDecoration: 'inherit',

  selectors: {
    '&.disabled': {
      pointerEvents: 'none',
      color: themeVars.color.muted,
    },
  },
});

export const item = style({
  display: 'flex',
  alignItems: 'center',
});

export const icon = style({
  padding: 10,
  display: 'flex',
  borderRadius: 30,
  transition: 'background-color 0.2s ease',

  selectors: {
    [`${link}:hover &`]: {
      backgroundColor: themeVars.color.backgroundLightest,
    },

    [`${link}.active &`]: {
      backgroundColor: themeVars.color.primary,
      color: themeVars.color.background,
    },
  },
});

export const label = style({
  display: 'none',

  '@media': {
    [breakpoints.medium]: {
      display: 'block',
      padding: 10,
    },
  },

  selectors: {
    [`${link}:hover:not(.active) &`]: {
      textDecoration: 'underline',
    },
  },
});
