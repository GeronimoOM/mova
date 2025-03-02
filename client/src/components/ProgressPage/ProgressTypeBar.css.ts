import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { themeVars } from '../../index.css';
import { accentColorStyle } from '../../utils/colors';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 500,
  margin: '0 auto',
  padding: '5px 10px',
  gap: 10,
  backgroundColor: themeVars.color.background,
});

export const icon = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    padding: 10,
  },

  variants: {
    color: accentColorStyle((colorVar) => ({
      color: colorVar,
    })),
  },
});

export const bar = style({
  flex: 1,
});

export const label = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'right',
    gap: 5,
    paddingLeft: 0,
  },

  variants: {
    color: accentColorStyle((colorVar) => ({
      color: colorVar,
    })),
  },
});

export const labelNumber = style({
  width: '1.5rem',
  fontWeight: 'bold',
});

export const labelCadence = style({
  color: themeVars.color.text,
  width: '4rem',
  fontSize: '1rem',
});
