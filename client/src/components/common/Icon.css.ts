import { recipe } from '@vanilla-extract/recipes';

export const icon = recipe({
  variants: {
    size: {
      small: {
        width: '1rem',
        height: '1rem',
      },

      medium: {
        width: '1.5rem',
        height: '1.5rem',
      },
    },
  },

  defaultVariants: {
    size: 'medium',
  },
});
