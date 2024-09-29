import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { themeVars } from '../../../index.css';

export const wrapper = style({
  position: 'relative',
});

export const button = recipe({
  base: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,

    padding: '3px 8px',
    backgroundColor: themeVars.color.background,
    fontWeight: 'bold',
    textTransform: 'lowercase',
    fontSize: '1rem',
    borderRadius: 20,
    border: `solid 2px ${themeVars.color.text}`,
    cursor: 'pointer',
    color: themeVars.color.text,
    zIndex: 5,

    selectors: {
      [`&:hover`]: {
        backgroundColor: themeVars.color.backgroundLighter,
      },
    },
  },

  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },
  },
});

export const placeholder = style({
  color: themeVars.color.muted,
});

export const dropdown = style({
  position: 'absolute',
  top: '50%',
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  textAlign: 'center',
  backgroundColor: themeVars.color.backgroundLight,
  border: `solid 2px ${themeVars.color.text}`,
  borderRadius: '0 0 20px 20px',
  borderTop: 'none',
  zIndex: 4,
});

export const dropdownItem = style({
  padding: 5,
  fontWeight: 'bold',
  textTransform: 'lowercase',
  fontSize: '1rem',
  cursor: 'pointer',

  selectors: {
    [`&:hover`]: {
      backgroundColor: themeVars.color.backgroundLighter,
    },

    [`&:first-child`]: {
      paddingTop: 20,
    },

    [`&:last-child`]: {
      borderRadius: '0 0 20px 20px',
    },
  },
});
