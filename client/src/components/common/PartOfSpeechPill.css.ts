import { recipe } from '@vanilla-extract/recipes';
import { themeVars } from '../../index.css';

export const pill = recipe({
  base: {
    backgroundColor: themeVars.color.background,

    fontWeight: 'bold',
    width: 'fit-content',
    textTransform: 'lowercase',
  },

  variants: {
    size: {
      medium: {
        padding: '2px 5px',
        fontSize: '0.8rem',
        borderRadius: 12,
        border: `solid 1px ${themeVars.color.text}`,
      },

      large: {
        fontSize: '1rem',
        borderRadius: 20,
        padding: '3px 8px',
        border: `solid 2px ${themeVars.color.text}`,
      },
    },
  },

  defaultVariants: {
    size: 'medium',
  },
});
