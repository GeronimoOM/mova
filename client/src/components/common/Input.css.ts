import { recipe } from '@vanilla-extract/recipes';
import {
  animations,
  jostFontFace,
  sourceCodeProFontFace,
  themeVars,
} from '../../index.css';

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
  },

  variants: {
    text: {
      original: {
        fontFamily: sourceCodeProFontFace,
        fontWeight: 500,
        letterSpacing: '0.025em',
      },

      translation: {
        fontFamily: jostFontFace,
      },
    },

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

    padding: {
      true: {
        paddingLeft: 50,
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
  },

  defaultVariants: {
    text: 'original',
    size: 'medium',
  },
});
