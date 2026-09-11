import { style } from '@vanilla-extract/css';
import { fontThemeVars, themeVars } from '../../../index.css';

export const modal = style({
  height: '90%',
  maxHeight: 700,
  width: '90%',
  maxWidth: 500,
});

export const wrapper = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export const titleRow = style({
  position: 'sticky',
  top: 0,
  padding: 10,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: themeVars.color.background,
});

export const title = style({
  fontFamily: fontThemeVars.monoFont,
  fontWeight: 500,
  letterSpacing: '0.025em',
  padding: 5,
  borderRadius: 3,
  backgroundColor: themeVars.color.backgroundLighter,
});

export const list = style({
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  padding: 10,
  gap: 10,
});

export const listItem = style({
  display: 'flex',
  gap: 10,
  padding: 10,
});

export const listItemContent = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  textWrap: 'wrap',
  gap: 5,
});

export const sentences = style({
  backgroundColor: themeVars.color.backgroundLight,
  display: 'flex',
  flexDirection: 'column',
  padding: 5,
  gap: 15,
});

export const example = style({
  fontFamily: fontThemeVars.monoFont,
  fontWeight: 500,
  letterSpacing: '0.025em',
  fontSize: '0.9rem',
});

export const exampleWord = style({
  borderBottom: `2px solid ${themeVars.color.backgroundLightest}`,
});

export const translation = style({
  fontStyle: 'italic',
  fontSize: '0.9rem',
});
