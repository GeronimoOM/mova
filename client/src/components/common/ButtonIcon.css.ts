import { globalStyle, style, StyleRule } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { animations, Color, Colors, themeVars } from '../../index.css';

export const button = recipe({
  base: {
    padding: 6,
    display: 'flex',
    cursor: 'pointer',
    borderRadius: 30,
    backgroundColor: themeVars.color.background,
    border: `2px solid ${themeVars.color.text}`,
    transition: 'color 0.2s ease, background-color 0.2s ease',

    selectors: {
      '&:hover': {
        backgroundColor: themeVars.color.backgroundLighter,
      },
    },
  },

  variants: {
    type: {
      default: {},
      ...(Object.fromEntries(
        Colors.map((color) => [
          color as Color,
          {
            selectors: {
              '&:hover': {
                color: themeVars.color[color],
                border: `2px solid ${themeVars.color[color]}`,
              },
            },
          },
        ]),
      ) as unknown as Record<Color, StyleRule>),
      primary: {
        color: themeVars.color.primary,
        border: `2px solid ${themeVars.color.primary}`,

        selectors: {
          '&:hover': {
            backgroundColor: themeVars.color.primary,
            color: themeVars.color.background,
          },
        },
      },
    },

    disabled: {
      true: {
        color: themeVars.color.muted,
        border: `2px solid ${themeVars.color.muted}`,
        pointerEvents: 'none',
      },
    },

    hidden: {
      true: {
        opacity: 0,
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

  defaultVariants: {
    type: 'default',
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