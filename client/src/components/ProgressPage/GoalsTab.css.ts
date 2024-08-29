import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { Colors, themeVars } from '../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 10,
  gap: 10,
});

export const goal = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 10,
  gap: 20,
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 500,
  backgroundColor: themeVars.color.background,
});

export const goalIcon = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    padding: 10,
  },

  variants: {
    color: Object.fromEntries(
      Colors.map((color) => [
        color,
        {
          color: themeVars.color[color],
        },
      ]),
    ),
  },
});

export const goalCadences = style({
  display: 'flex',
  flexDirection: 'row',
  gap: 10,
});

export const goalCadence = recipe({
  base: {
    padding: '5px 10px',
    textTransform: 'lowercase',
    borderBottom: `3px solid transparent`,
    cursor: 'pointer',
    transition: 'border 0.2s ease',
  },

  variants: {
    color: Object.fromEntries(
      Colors.map((color) => [
        color,
        {
          selectors: {
            '&.selected, &:hover': {
              borderBottom: `3px solid ${themeVars.color[color]}`,
            },
          },
        },
      ]),
    ),
  },
});

export const goalInput = style({
  width: '4rem',
});

globalStyle(`${goalInput} input`, {
  textAlign: 'center',
  fontWeight: 'bold',
  textShadow: '1px 1px black',
});

export const buttons = style({
  display: 'flex',
  flexDirection: 'row',
  gap: 10,
  padding: 10,
  justifyContent: 'center',
});
