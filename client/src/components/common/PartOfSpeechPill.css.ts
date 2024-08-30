import { recipe } from '@vanilla-extract/recipes';
import { themeVars } from '../../index.css';

export const pill = recipe({
  base: {
    backgroundColor: themeVars.color.background,
    fontWeight: 'bold',
    width: 'fit-content',
    textTransform: 'lowercase',
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
    size: {
      medium: {
        padding: '2px 5px',
        fontSize: '0.75rem',
        borderRadius: 12,
        border: `solid 2px ${themeVars.color.text}`,
      },

      large: {
        padding: '3px 8px',
        fontSize: '1rem',
        borderRadius: 20,
        border: `solid 2px ${themeVars.color.text}`,
      },
    },

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
    size: 'medium',
    disabled: false,
  },
});
