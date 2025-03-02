import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { fontThemeVars, notSelectable, themeVars } from '../../index.css';
import { accentAndOptionColorStyle } from '../../utils/colors';

export const option = recipe({
  base: {
    width: 'fit-content',
    height: 'calc(0.75rem + 12px)', // TODO fix
    fontFamily: fontThemeVars.monoFont,
    fontWeight: 600,
    borderRadius: 16,
    padding: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
    ...notSelectable,

    color: themeVars.color.text,
    border: `2px solid ${themeVars.color.text}`,
    backgroundColor: themeVars.color.backgroundDarker,

    selectors: {
      '&:hover': {
        backgroundColor: themeVars.color.background,
      },
    },
  },

  variants: {
    color: accentAndOptionColorStyle((colorVar) => ({
      color: colorVar,
      border: `2px solid ${colorVar}`,
    })),

    empty: {
      true: {
        color: themeVars.color.muted,
        border: `2px solid ${themeVars.color.muted}`,
        backgroundColor: themeVars.color.background,

        selectors: {
          '&:hover': {
            backgroundColor: themeVars.color.backgroundLight,
          },
        },
      },
    },

    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },

    deleted: {
      true: {
        pointerEvents: 'none',
        borderStyle: 'dashed',
        backgroundColor: `${themeVars.color.backgroundDarker} !important`,
        opacity: 0.5,
        cursor: 'default',
      },
    },
  },
});

export const buttons = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 5,
});

export const restore = style({
  pointerEvents: 'auto',
});

export const colors = style({
  padding: 10,
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: 5,
});
