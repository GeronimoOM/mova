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
  paddingRight: 0,
  selectors: {
    '&:not(.disabled)': {
      marginRight: 65,
    },
  },
});

export const detailsRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
});

export const detailsRowGap = style({
  margin: `0 5px`,
  borderTop: `2px solid ${themeVars.color.backgroundLight}`,
});

export const originalRow = style({
  selectors: {
    '&:not(.disabled)': {
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
  fontWeight: 500,
  letterSpacing: '0.025em',
  padding: 5,
  borderRadius: 3,
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

export const icon = style({
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

export const buttonsTop = style({
  position: 'absolute',
  top: 20,
  right: 28,

  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  zIndex: 10,
});

export const buttonsBottom = style({
  position: 'absolute',
  bottom: 20,
  right: 28,

  backgroundColor: themeVars.color.background,
  borderRadius: 30,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  zIndex: 10,
});

export const detailsEnd = style({
  minHeight: 66,
});

export const deleteConfirm = style({
  minWidth: '200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 10,
  gap: 30,
});

export const deleteConfirmText = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 10,
});

export const deleteConfirmWord = style({
  fontFamily: fontThemeVars.monoFont,
  padding: 5,
  borderRadius: 3,
  backgroundColor: themeVars.color.backgroundLighter,
});

export const deleteConfirmButtons = style({
  display: 'flex',
  flexDirection: 'row',
  gap: 10,
});
