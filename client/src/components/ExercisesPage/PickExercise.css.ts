import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { fontThemeVars, themeVars } from '../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 15,
});

export const title = style({
  padding: 5,
  textAlign: 'center',
  color: themeVars.color.muted,
  fontWeight: 'bold',
});

export const options = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: 15,
});

export const option = recipe({
  base: {
    display: 'flex',
    flexDirection: 'row',
    height: '1.5rem',
    padding: '15px 20px',
    borderRadius: 3,
    backgroundColor: themeVars.color.backgroundLighter,
    transition: 'background-color 0.2s ease',
    cursor: 'pointer',

    selectors: {
      '&:hover, &:focus': {
        backgroundColor: themeVars.color.backgroundLightest,
      },
    },
  },

  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },

    outline: {
      true: {
        outline: `2px solid ${themeVars.color.primary}`,
      },
    },
  },
});

export const optionText = style({
  marginRight: 'auto',
  fontFamily: fontThemeVars.monoFont,
  fontWeight: 500,
  letterSpacing: '0.025em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const buttons = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});
