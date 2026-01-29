import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { themeVars } from '../../../index.css';

export const mastery = recipe({
  base: {
    padding: '1px 3px',
    borderRadius: 5,
    backgroundColor: themeVars.color.backgroundLight,
    border: '2px dashed transparent',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',

    selectors: {
      '&:hover': {
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
    border: {
      dotted: {
        border: `2px dotted ${themeVars.color.secondary1}`,
      },
      dashed: {
        border: `2px dashed ${themeVars.color.secondary1}`,
      },
      solid: {
        border: `2px solid ${themeVars.color.secondary1}`,
      },
    },
  },
});

export const tooltip = style({
  padding: 10,
  display: 'grid',
  gridTemplateRows: 'auto auto',
  gridTemplateColumns: '1fr 2fr',
  gap: '2px 15px',
  whiteSpace: 'nowrap',
  minWidth: 'fit-content',
});

export const tooltipValue = style({
  fontWeight: 'bold',
});

export const resetButton = style({
  padding: 5,
  gridColumn: 'span 2',
  justifySelf: 'center',
});
