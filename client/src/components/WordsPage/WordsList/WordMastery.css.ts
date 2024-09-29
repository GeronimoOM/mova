import { style } from '@vanilla-extract/css';
import { themeVars } from '../../../index.css';

export const mastery = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  color: themeVars.color.secondary1,
  padding: 5,
  borderRadius: 5,

  selectors: {
    '&:hover': {
      backgroundColor: themeVars.color.backgroundLight,
    },
  },
});

export const tooltip = style({
  padding: 10,
  display: 'flex',
  flexDirection: 'column',
  whiteSpace: 'nowrap',
  minWidth: 'fit-content',
});

export const tooltipDate = style({
  color: themeVars.color.secondary1,
});
