import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
});

export const pill = style({
  display: 'flex',
  flexDirection: 'row',
  gap: 5,
  padding: 5,
  color: themeVars.color.muted,
  borderRadius: 5,
  cursor: 'default',

  selectors: {
    '&:not(.disabled)': {
      backgroundColor: themeVars.color.backgroundLight,
      cursor: 'pointer',
    },

    '&:not(.disabled):hover': {
      backgroundColor: themeVars.color.backgroundLighter,
    },
  },
});

export const typeLabel = style({
  textTransform: 'lowercase',
});
