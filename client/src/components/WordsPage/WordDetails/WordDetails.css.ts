import { globalStyle, style } from '@vanilla-extract/css';
import { themeVars } from '../../../index.css';

export const wrapper = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
});

export const innerWrapper = style({
  height: '100%',
  overflowY: 'scroll',
  margin: 10,
  padding: '15px 10px',
  backgroundColor: themeVars.color.background,
});

export const details = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  minHeight: 0,
  marginRight: 50,
});

export const detailsHeader = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

export const translationLabel = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 5,
  color: themeVars.color.muted,
  fontSize: '0.8rem',
  fontWeight: 'bold',
});

export const buttons = style({
  position: 'absolute',
  top: 15,
  bottom: 15,
  right: 18,
  padding: 10,
  gap: 20,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: themeVars.color.background,
  zIndex: 10,
});

globalStyle(`${buttons} > *:last-child`, {
  marginTop: 'auto',
});
