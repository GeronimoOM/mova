import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { colors, themeVars } from '../../index.css';

export const container = style({
  width: '100%',
  backgroundColor: themeVars.color.backgroundLighter,
});

export const bar = recipe({
  base: {
    height: 10,
  },

  variants: {
    color: Object.fromEntries(
      colors.map((color) => [
        color,
        {
          backgroundColor: themeVars.color[color],
        },
      ]),
    ),
  },

  defaultVariants: {
    color: 'primary',
  },
});
