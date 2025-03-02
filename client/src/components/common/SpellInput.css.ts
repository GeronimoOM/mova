import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { fontThemeVars, themeVars } from '../../index.css';
import { accentColorStyle } from '../../utils/colors';

export const container = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 3,
  alignItems: 'center',
});

export const cell = recipe({
  base: {
    border: 'none',
    outline: 'none',
    padding: '10px 3px',
    boxSizing: 'border-box',
    width: 'calc(1rem + 6px)',
    fontSize: '1rem',
    textAlign: 'center',
    backgroundColor: themeVars.color.backgroundLight,
    color: themeVars.color.text,
    transition: 'background-color 0.2s ease',
    fontFamily: fontThemeVars.monoFont,
    fontWeight: 600,
    letterSpacing: '0.025em',

    selectors: {
      '&.hidden': {
        display: 'none',
      },

      '&.muted': {
        opacity: 0.5,
      },
    },
  },

  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },

    highlight: accentColorStyle((colorVar) => ({
      color: colorVar,
    })),
  },
});

globalStyle(
  `${cell}:hover, ${cell}:has(~${cell}:hover), ${cell}:hover ~ ${cell}, ${container}:has(${cell}:focus) ${cell}`,
  {
    backgroundColor: themeVars.color.backgroundLighter,
  },
);
