import { style } from '@vanilla-extract/css';
import { fontThemeVars, themeVars } from '../../../index.css';

export const wrapper = style({
  gridRow: '1 / 3',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  height: '100%',
});

export const innerWrapper = style({
  height: '100%',
  overflowY: 'scroll',
  margin: 10,
  padding: 10,
  backgroundColor: themeVars.color.background,
  outline: `1px solid ${themeVars.color.background}`,
});

export const details = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 15,
  minHeight: 0,
});

export const detailsHeader = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 5,
  paddingRight: 0,
  selectors: {
    '&:not(.simplified)': {
      marginRight: 65,
    },
  },
});

export const detailsRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
});

export const originalRow = style({
  selectors: {
    '&:not(.simplified)': {
      marginRight: 65,
    },
  },
});

export const existingWarningIcon = style({
  display: 'flex',
  alignItems: 'center',
  color: themeVars.color.negative,
});

export const existingWarningTooltip = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  padding: 10,
  gap: 10,
  whiteSpace: 'nowrap',
});

export const existingWarningWord = style({
  fontFamily: fontThemeVars.monoFont,
  padding: 5,
  borderRadius: 5,
  backgroundColor: themeVars.color.backgroundLighter,
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',

  selectors: {
    '&:hover': {
      backgroundColor: themeVars.color.backgroundLightest,
    },
  },
});

export const translationLabel = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  color: themeVars.color.muted,
  fontWeight: 'bold',
});

export const translationIcon = style({
  display: 'flex',
  alignItems: 'center',
  padding: 5,
  color: themeVars.color.muted,
});

export const translationRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 5,
});

export const buttons = style({
  position: 'absolute',
  top: 10,
  bottom: 10,
  right: 18,

  padding: 10,
  gap: 10,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 10,
});

export const bottomButton = style({
  marginTop: 'auto',
});

export const detailsEnd = style({
  minHeight: 50,
});
