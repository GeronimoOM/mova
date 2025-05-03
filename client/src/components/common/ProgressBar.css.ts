import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { themeVars } from '../../index.css';
import { accentColorStyle } from '../../utils/colors';

export const container = style({
  width: '100%',
  backgroundColor: themeVars.color.backgroundLighter,
});

export const bar = recipe({
  base: {
    height: 10,
  },

  variants: {
    color: accentColorStyle((colorVar) => ({
      backgroundColor: colorVar,
    })),
  },

  defaultVariants: {
    color: 'primary',
  },
});
