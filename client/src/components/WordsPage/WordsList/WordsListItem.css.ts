import { style } from '@vanilla-extract/css';
import { sourceCodeProFontFace, themeVars } from '../../../index.css';

export const item = style({
  display: 'grid',
  gridColumn: '1 / 3',
  gridTemplateColumns: 'subgrid',
  gridTemplateRows: 'auto auto',
  alignItems: 'center',
  gap: '2px 10px',
  padding: '5px 10px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',

  selectors: {
    [`&:hover`]: {
      backgroundColor: themeVars.color.backgroundLighter,
    },
  },
});

export const original = style({
  fontFamily: sourceCodeProFontFace,
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
  backgroundColor: themeVars.color.background,
  margin: 5,
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
