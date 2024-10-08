import { style } from '@vanilla-extract/css';
import { fontThemeVars, themeVars } from '../../../index.css';

export const item = style({
  display: 'grid',
  gridColumn: '1 / 3',
  gridTemplateColumns: 'subgrid',
  gridTemplateRows: 'auto',
  alignItems: 'center',
  gap: '5px 10px',
  padding: 10,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  borderBottom: `1px solid ${themeVars.color.backgroundLighter}`,

  selectors: {
    [`&:hover`]: {
      backgroundColor: themeVars.color.backgroundLighter,
    },
  },
});

export const original = style({
  fontFamily: fontThemeVars.monoFont,
  fontWeight: 500,
  letterSpacing: '0.025em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const translation = style({
  gap: 10,
  gridColumn: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const divider = style({
  gridColumn: '1 / 3',
  padding: 5,
  borderBottom: `1px solid ${themeVars.color.backgroundLighter}`,
});

export const dividerInner = style({
  padding: 5,
  backgroundColor: themeVars.color.background,
  fontSize: '0.8rem',
  display: 'flex',
  alignItems: 'center',
  color: themeVars.color.muted,
});

export const dividerTotal = style({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 30,
  width: '1.5rem',
  height: '1.5rem',
  fontWeight: 'bold',
  color: themeVars.color.background,
  backgroundColor: themeVars.color.secondary2,
});
