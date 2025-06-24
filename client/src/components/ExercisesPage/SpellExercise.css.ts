import { style } from '@vanilla-extract/css';
import { fontThemeVars, themeVars } from '../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 15,
  padding: '0 1px',
});

export const title = style({
  padding: 5,
  textAlign: 'center',
  color: themeVars.color.muted,
  fontWeight: 'bold',
});

export const property = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
});

export const propertyLabel = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 5,
  color: themeVars.color.muted,
  fontWeight: 'bold',
  textTransform: 'lowercase',
});

export const result = style({
  marginTop: 10,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  gap: 20,
  padding: 10,
});

export const optionPropertyRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 20,
});

export const optionPropertyPill = style({
  flex: 1,
});

export const optionPropertyResult = style({
  display: 'flex',
  flex: 0,
});

export const similarMessage = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
});

export const similarMessageWord = style({
  fontFamily: fontThemeVars.monoFont,
  fontWeight: 500,
  letterSpacing: '0.025em',
  height: '1.5rem',
  padding: '5px 10px',
  borderRadius: 3,
  backgroundColor: themeVars.color.backgroundLighter,
});

export const similarMessageText = style({
  color: themeVars.color.muted,
  fontStyle: 'italic',
});
