import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { animations, colors, themeVars } from '../../index.css';

export const button = recipe({
  base: {
    padding: 6,
    display: 'flex',
    cursor: 'pointer',
    borderRadius: 30,
    backgroundColor: themeVars.color.background,
    border: `2px solid ${themeVars.color.text}`,
    transition: 'color 0.2s ease, background-color 0.2s ease, border 0.2s ease',

    selectors: {
      '&:hover': {
        backgroundColor: themeVars.color.backgroundLighter,
      },
    },
  },

  variants: {
    color: Object.fromEntries(
      colors.map((color) => [
        color,
        {
          selectors: {
            '&:hover': {
              color: themeVars.color[color],
              border: `2px solid ${themeVars.color[color]}`,
              backgroundColor: themeVars.color.background,
            },
            '&.highlighted': {
              color: themeVars.color[color],
              border: `2px solid ${themeVars.color[color]}`,
            },
            '&.highlighted:hover, &.toggled': {
              backgroundColor: themeVars.color[color],
              color: themeVars.color.background,
              border: `2px solid ${themeVars.color[color]}`,
            },
          },
        },
      ]),
    ),

    disabled: {
      true: {
        color: `${themeVars.color.muted} !important`,
        border: `2px solid ${themeVars.color.muted} !important`,
        pointerEvents: 'none',
      },
    },

    loading: {
      true: {
        animationName: animations.rotate,
        animationDuration: '1s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        pointerEvents: 'none',
      },
    },
  },
});

export const wrapper = style({
  border: `2px solid ${themeVars.color.text}`,
  backgroundColor: themeVars.color.background,
  padding: 5,
  borderRadius: 30,
});

globalStyle(`${button}.empty svg`, {
  opacity: 0,
});
