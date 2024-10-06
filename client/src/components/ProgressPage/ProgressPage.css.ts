import { style } from '@vanilla-extract/css';
import { themeVars } from '../../index.css';

export const wrapper = style({
  height: '100%',
  backgroundColor: themeVars.color.backgroundLight,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
});

export const tabs = style({
  display: 'flex',
  justifyContent: 'space-around',
  padding: 10,
  paddingBottom: 5,
  backgroundColor: themeVars.color.background,
});

export const tab = style({
  display: 'flex',
  alignItems: 'center',
  padding: '5px 10px',
  gap: 5,
  cursor: 'pointer',
  transition: 'border 0.2s ease',
  borderBottom: '3px solid transparent',
  fontWeight: 'bold',

  selectors: {
    [`&:hover, &.active`]: {
      borderBottom: `3px solid ${themeVars.color.primary}`,
    },
    '&.mini': {
      fontSize: '0.8rem',
    },
  },
});
