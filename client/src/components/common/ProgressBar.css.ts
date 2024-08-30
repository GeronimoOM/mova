import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { Colors, themeVars } from '../../index.css';

export const container = style({
  width: '100%',
  backgroundColor: themeVars.color.backgroundLightest,
});

export const bar = recipe({
  base: {
    height: 10,
  },

  variants: {
    color: Object.fromEntries(
      Colors.map((color) => [
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
