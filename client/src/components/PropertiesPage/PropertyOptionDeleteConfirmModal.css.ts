import { style } from '@vanilla-extract/css';
import { fontThemeVars, themeVars } from '../../index.css';

export const content = style({
  minWidth: 300,
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
  borderRadius: 5,
  backgroundColor: themeVars.color.backgroundLighter,
});

export const usageTitle = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'start',
});

export const usageRows = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

export const usageRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
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
