import { recipe } from '@vanilla-extract/recipes';
import { themeVars } from '../../index.css';

export const pill = recipe({
  base: {
    backgroundColor: themeVars.color.background,
    fontWeight: 'bold',
    width: 'fit-content',
    textTransform: 'lowercase',
    padding: '3px 8px',
    fontSize: '1rem',
    borderRadius: 20,
    border: `solid 2px ${themeVars.color.text}`,
    transition: 'color 0.2s ease, background-color 0.2s ease',

    selectors: {
      '&.active': {
        backgroundColor: themeVars.color.primary,
        color: themeVars.color.background,
        borderColor: themeVars.color.primary,
      },
    },
  },

  variants: {
    disabled: {
      false: {
        selectors: {
          '&:hover:not(.active)': {
            backgroundColor: themeVars.color.backgroundLighter,
          },
        },
      },
    },
  },

  defaultVariants: {
    disabled: false,
  },
});
