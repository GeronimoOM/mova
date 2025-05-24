import { recipe } from '@vanilla-extract/recipes';
import { accentAndOptionColorStyle } from '../../utils/colors';

export const icon = recipe({
  variants: {
    size: {
      tiny: {
        width: '0.75rem',
        height: '0.75rem',
      },

      small: {
        width: '1rem',
        height: '1rem',
      },

      medium: {
        width: '1.5rem',
        height: '1.5rem',
      },

      large: {
        width: '2.5rem',
        height: '2.5rem',
      },
    },

    color: accentAndOptionColorStyle((colorVar) => ({
      color: colorVar,
    })),
  },

  defaultVariants: {
    size: 'medium',
  },
});
