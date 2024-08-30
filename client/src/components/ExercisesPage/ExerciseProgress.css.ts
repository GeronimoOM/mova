import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { colors, themeVars } from '../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 500,
  margin: '0 auto',
  gap: 10,
});

export const icon = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    padding: 10,
  },

  variants: {
    color: Object.fromEntries(
      colors.map((color) => [color, { color: themeVars.color[color] }]),
    ),
  },
});

export const bar = style({
  flex: 1,
});

export const label = style({
  textAlign: 'right',
  marginLeft: 'auto',
  minWidth: '4rem',
  margin: 10,
});
