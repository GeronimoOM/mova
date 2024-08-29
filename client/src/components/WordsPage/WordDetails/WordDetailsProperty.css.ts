import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { animations, themeVars } from '../../../index.css';

export const label = style({
  color: themeVars.color.muted,
  fontWeight: 'bold',
  textTransform: 'lowercase',
});

export const labelSkeleton = recipe({
  base: {
    height: '0.8rem',
    width: 50,
    backgroundColor: themeVars.color.muted,
    borderRadius: 10,
    animationName: animations.pulse,
    animationDuration: '2s',
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
    animationIterationCount: 'infinite',
  },

  variants: {
    length: {
      small: {
        width: 50,
      },
      medium: {
        width: 70,
      },
      large: {
        width: 100,
      },
    },
  },

  defaultVariants: {
    length: 'medium',
  },
});