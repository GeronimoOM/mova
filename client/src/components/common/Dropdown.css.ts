import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { themeVars } from '../../index.css';

export const wrapper = style({
  position: 'relative',
  width: 'fit-content',
});

export const dropdown = recipe({
  base: {
    position: 'absolute',
    zIndex: 100,
    boxSizing: 'border-box',
    backgroundColor: `${themeVars.color.background}`,
    outline: `1px solid ${themeVars.color.text}`,
    borderRadius: 4,
  },

  variants: {
    position: {
      bottom: {
        top: `calc(100% + 5px)`,
      },
      top: {
        bottom: `calc(100% + 5px)`,
      },
    },
    alignment: {
      start: {
        left: 0,
      },
      center: {
        left: '50%',
        transform: 'translateX(-50%)',
      },
      end: {
        right: 0,
      },
    },
  },

  defaultVariants: {
    position: 'bottom',
    alignment: 'center',
  },
});
