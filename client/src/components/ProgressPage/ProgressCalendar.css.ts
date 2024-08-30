import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { colors, themeVars } from '../../index.css';

export const wrapper = style({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 500,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  padding: 10,
  gap: 10,
  backgroundColor: themeVars.color.background,
});

export const table = style({
  padding: 10,
  borderSpacing: 0.5,
  maxWidth: 'fit-content',
  margin: '0 auto',
});

globalStyle(`${table} > thead > tr > td`, {
  paddingBottom: 5,
});

globalStyle(`${table} > tbody > tr:last-child > td`, {
  paddingTop: 15,
});

export const weekLabel = style({
  paddingRight: 5,
  fontSize: '0.7rem',
  color: themeVars.color.muted,
});

export const monthLabel = style({
  fontSize: '0.8rem',
  color: themeVars.color.muted,
  textAlign: 'center',
});

export const cellWrapper = recipe({
  variants: {
    selected: {
      true: {
        outline: `2px solid ${themeVars.color.muted}`,
      },
    },
  },
});

export const cell = recipe({
  base: {
    width: '1rem',
    height: '1rem',
    backgroundColor: themeVars.color.backgroundLighter,
  },

  variants: {
    color: Object.fromEntries(
      colors.map((color) => [
        color,
        {
          backgroundColor: themeVars.color[color],
        },
      ]),
    ),

    intensity: {
      30: {
        opacity: 0.3,
      },
      60: {
        opacity: 0.6,
      },
      80: {
        opacity: 0.85,
      },
      100: {
        opacity: 1,
      },
    },
  },
});

export const cellTooltip = style({
  display: 'flex',
  flexDirection: 'column',
  padding: 5,
  gap: 5,
  whiteSpace: 'nowrap',
  color: themeVars.color.text,
});

export const cellTooltipDate = style({
  fontSize: '0.8rem',
  color: themeVars.color.muted,
});

export const cellTooltipPoints = recipe({
  base: {
    fontWeight: 'bold',
  },

  variants: {
    color: Object.fromEntries(
      colors.map((color) => [color, { color: themeVars.color[color] }]),
    ),
  },
});

export const typeButtons = style({
  display: 'flex',
  flexDirection: 'row',
  padding: 10,
  gap: 10,
  justifyContent: 'center',
});

globalStyle(`${typeButtons} > *:last-child`, {
  marginLeft: 30,
});
