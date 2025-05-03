import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { themeVars } from '../../../index.css';

export const button = recipe({
  base: {
    minWidth: 70,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,

    padding: '3px 8px',
    backgroundColor: themeVars.color.background,
    fontWeight: 'bold',
    textTransform: 'lowercase',
    fontSize: '1rem',
    borderRadius: 5,
    outline: `solid 2px ${themeVars.color.text}`,
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

export const buttonText = style({
  flex: 1,
  textAlign: 'center',
});

export const placeholder = style({
  color: themeVars.color.muted,
});

export const dropdown = style({
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  textAlign: 'center',
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
  },
});
