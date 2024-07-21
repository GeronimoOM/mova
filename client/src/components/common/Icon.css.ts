import { recipe } from '@vanilla-extract/recipes';

export const icon = recipe({
  variants: {
    size: {
      medium: {
        width: '1.5rem',
        height: '1.5rem',
      },

      small: {
        width: '1rem',
        height: '1rem',
      },
    },
  },

  defaultVariants: {
    size: 'medium',
  },
});
