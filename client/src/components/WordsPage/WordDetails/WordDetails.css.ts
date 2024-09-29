import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { themeVars } from '../../../index.css';

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
  padding: '15px 10px',
  backgroundColor: themeVars.color.background,
});

export const details = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    minHeight: 0,
    marginRight: 50,
  },

  variants: {
    simplified: {
      true: {
        marginRight: 0,
      },
    },
  },
});

export const detailsHeader = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: 5,
});

export const translationLabel = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 5,
  color: themeVars.color.muted,
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

export const bottomButton = style({
  marginTop: 'auto',
});
