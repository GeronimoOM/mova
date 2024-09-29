import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import {
  jostFontFace,
  sourceCodeProFontFace,
  themeVars,
  verdanaFontFace,
} from '../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxSizing: 'border-box',
  height: '100%',
  padding: 10,
  backgroundColor: themeVars.color.backgroundLight,
});

export const content = style({
  flex: 1,
  width: '100%',
  maxWidth: 500,
  display: 'flex',
  flexDirection: 'column',
  gap: 15,
});

export const card = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px 10px',
  gap: 10,
  backgroundColor: themeVars.color.background,
});

globalStyle(`${content} > ${card}:last-child`, {
  marginTop: 'auto',
});

export const flag = style({
  display: 'flex',
  width: '2.5rem',
  height: '2.5rem',
  padding: 3,
  border: `3px solid transparent`,
  borderRadius: '100%',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease, border 0.2s ease',

  selectors: {
    '&:hover, &.selected': {
      border: `3px solid ${themeVars.color.primary}`,
      backgroundColor: themeVars.color.backgroundLighter,
    },
  },
});

globalStyle(`${flag} svg`, {
  borderRadius: '100%',
  border: `3px solid ${themeVars.color.text}`,
});

export const font = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '2rem',
  padding: 10,
  gap: 5,
  borderRadius: 5,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease, border 0.2s ease',
  border: `2px solid transparent`,

  selectors: {
    '&:hover, &.selected': {
      border: `2px solid ${themeVars.color.primary}`,
      backgroundColor: themeVars.color.backgroundLighter,
    },
  },
});

export const fontBase = recipe({
  variants: {
    font: {
      default: {
        fontFamily: jostFontFace,
      },
      classic: {
        fontFamily: verdanaFontFace,
      },
    },
  },
});

export const fontMono = recipe({
  variants: {
    font: {
      default: {
        fontFamily: sourceCodeProFontFace,
      },
      classic: {
        fontFamily: verdanaFontFace,
      },
    },
  },
});
