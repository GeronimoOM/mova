import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { animations, themeVars } from '../../../index.css';

export const row = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
});

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

export const optionWrapper = style({
  height: 40,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
});
