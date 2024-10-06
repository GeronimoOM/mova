import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { themeVars } from '../../index.css';

export const relative = style({
  position: 'relative',
  cursor: 'pointer',
});

export const tooltip = recipe({
  base: {
    position: 'absolute',
    zIndex: 20,
    backgroundColor: themeVars.color.backgroundLight,
    outline: `1px solid ${themeVars.color.background}`,
  },

  variants: {
    side: {
      top: {
        bottom: 'calc(100% + 5px)',
        left: '50%',
        transform: 'translate(-50%)',
      },
      left: {
        right: 'calc(100% + 5px)',
        top: '50%',
        transform: 'translateY(-50%)',
      },
      right: {
        left: 'calc(100% + 5px)',
        top: '50%',
        transform: 'translateY(-50%)',
      },
      bottom: {
        top: 'calc(100% + 5px)',
        left: '50%',
        transform: 'translate(-50%)',
      },
      bottomLeft: {
        top: 'calc(100% + 5px)',
        right: 0,
      },
      bottomRight: {
        top: 'calc(100% + 5px)',
        left: 0,
      },
    },
  },

  defaultVariants: {
    side: 'top',
  },
});
