import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  padding: 10,
  gap: 10,
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  maxHeight: 150,
  gap: 5,
});

export const divider = style({
  borderRadius: '20px 0 0 20px',
  backgroundColor: themeVars.color.backgroundDarker,
});

export const listItem = style({
  padding: '5px 10px',
  cursor: 'pointer',
  borderBottom: `1px solid ${themeVars.color.backgroundLighter}`,
  textTransform: 'lowercase',

  selectors: {
    '&:hover': {
      backgroundColor: themeVars.color.backgroundLight,
    },
  },
});
