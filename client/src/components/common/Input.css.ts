import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { animations, colors, fontThemeVars, themeVars } from '../../index.css';

export const wrapper = style({
  position: 'relative',
  width: '100%',
});

export const left = style({
  position: 'absolute',
  left: 10,
  top: 10,
  bottom: 10,
  display: 'flex',
  alignItems: 'center',
});

export const right = style({
  position: 'absolute',
  right: 10,
  top: 10,
  bottom: 10,
  display: 'flex',
  alignItems: 'center',
});

export const input = recipe({
  base: {
    border: 'none',
    outline: 'none',
    padding: '20px 10px',
    boxSizing: 'border-box',
    width: '100%',
    backgroundColor: themeVars.color.backgroundLight,
    color: themeVars.color.text,
    transition: 'background-color 0.2s ease',

    selectors: {
      '&:hover, &:focus': {
        backgroundColor: themeVars.color.backgroundLighter,
      },
    },

    '::placeholder': {
      color: themeVars.color.muted,
    },
  },

  variants: {
    text: {
      original: {
        fontFamily: fontThemeVars.monoFont,
        fontWeight: 500,
        letterSpacing: '0.025em',

        '::placeholder': {
          fontFamily: fontThemeVars.monoFont,
          fontWeight: 500,
          letterSpacing: '0.025em',
        },
      },

      translation: {
        fontFamily: fontThemeVars.baseFont,

        '::placeholder': {
          fontFamily: fontThemeVars.baseFont,
        },
      },
    },

    textColor: Object.fromEntries(
      colors.map((color) => [
        color,
        {
          color: themeVars.color[color],
        },
      ]),
    ),

    size: {
      medium: {
        fontSize: '1rem',
        height: '1.5rem',
      },
      large: { fontSize: '1.25rem', height: '2rem' },
    },

    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },

    left: {
      true: {
        paddingLeft: 45,
      },
    },

    right: {
      true: {
        paddingRight: 45,
      },
    },

    loading: {
      true: {
        fontSize: 0,
        lineHeight: 0,
        animationName: animations.pulse,
        animationDuration: '2s',
        animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
        animationIterationCount: 'infinite',
      },
    },

    obscured: {
      true: {
        color: 'transparent',
        backgroundColor: themeVars.color.backgroundLightest,
      },
    },
  },

  defaultVariants: {
    text: 'original',
    size: 'medium',
  },
});
