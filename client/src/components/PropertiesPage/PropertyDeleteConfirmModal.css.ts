import { style } from '@vanilla-extract/css';
import { fontThemeVars, themeVars } from '../../index.css';

export const content = style({
  minWidth: 200,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 10,
  gap: 10,
});

export const title = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 10,
  fontWeight: 'bold',
});

export const property = style({
  fontFamily: fontThemeVars.baseFont,
  fontWeight: 'normal',
  fontSize: '1.25rem',
  textTransform: 'lowercase',
  padding: '5px 10px',
  borderRadius: 3,
  backgroundColor: themeVars.color.backgroundLighter,
});

export const usage = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
});

export const usageNumber = style({
  color: themeVars.color.primary,
  fontWeight: 'bold',
});

export const buttons = style({
  paddingTop: 30,
  display: 'flex',
  flexDirection: 'row',
  gap: 10,
});
