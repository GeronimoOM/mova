import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { animations, themeVars } from '../../index.css';
import { accentAndOptionColorStyle } from '../../utils/colors';

export const button = recipe({
  base: {
    width: 'min-content',
    height: 'min-content',
    padding: 6,
    display: 'flex',
    cursor: 'pointer',
    borderRadius: 30,
    color: themeVars.color.text,
    backgroundColor: themeVars.color.background,
    border: `2px solid ${themeVars.color.text}`,
    transition: 'color 0.2s ease, background-color 0.2s ease, border 0.2s ease',

    selectors: {
      '&:hover': {
        backgroundColor: themeVars.color.backgroundLighter,
      },
      '&.toggled': {
        backgroundColor: themeVars.color.text,
        border: `2px solid ${themeVars.color.text}`,
        color: themeVars.color.background,
      },
    },
  },

  variants: {
    color: accentAndOptionColorStyle((colorVar) => ({
      selectors: {
        '&:hover': {
          color: colorVar,
          border: `2px solid ${colorVar}`,
          backgroundColor: themeVars.color.background,
        },
        '&.highlighted, &.highlightedAlt': {
          color: colorVar,
          border: `2px solid ${colorVar}`,
        },
        '&.highlighted:hover, &.toggled': {
          backgroundColor: colorVar,
          color: themeVars.color.background,
          border: `2px solid ${colorVar}`,
        },
        '&.highlightedAlt:hover:not(.toggled)': {
          backgroundColor: themeVars.color.backgroundLighter,
        },
      },
    })),

    disabled: {
      true: {
        pointerEvents: 'none',

        selectors: {
          '&:not(.toggled)': {
            color: `${themeVars.color.muted} !important`,
            border: `2px solid ${themeVars.color.muted} !important`,
          },
        },
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
  outline: `1px solid ${themeVars.color.background}`,
  backgroundColor: themeVars.color.backgroundLight,
  padding: 8,
  borderRadius: 30,
});

globalStyle(`${button}.empty svg`, {
  opacity: 0,
});

globalStyle(`${button}.borderless`, {
  border: 'none !important',
});
