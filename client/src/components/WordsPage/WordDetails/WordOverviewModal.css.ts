import { style } from '@vanilla-extract/css';
import { breakpoints, fontThemeVars, themeVars } from '../../../index.css';

export const wrapper = style({
  height: 500,
  width: 300,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '@media': {
    [breakpoints.small]: {
      minWidth: 400,
    },
    [breakpoints.large]: {
      minWidth: 500,
    },
  },
});

export const title = style({
  margin: '0 auto',
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

export const interpretation = style({
  paddingBottom: 3,
  borderBottom: `2px solid ${themeVars.color.backgroundLighter}`,
});

export const example = style({
  fontFamily: fontThemeVars.monoFont,
  fontWeight: 500,
  letterSpacing: '0.025em',
  fontSize: '0.9rem',
});

export const translation = style({
  fontStyle: 'italic',
  fontSize: '0.9rem',
});
