import { globalStyle, style } from '@vanilla-extract/css';
import { fontThemeVars, themeVars } from '../../../index.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
  paddingRight: 5,
});

export const labelRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  color: themeVars.color.muted,
  fontWeight: 'bold',
  gap: 8,
});

globalStyle(`${labelRow} > *:last-child`, {
  marginLeft: 'auto',
});

export const list = style({
  gap: 5,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 4fr) min-content',
  gridAutoRows: 'min-content',
  alignItems: 'center',
});

export const listItem = style({
  display: 'grid',
  gridColumn: '1 / 4',
  gridTemplateColumns: 'subgrid',
  gridTemplateRows: 'auto',
  alignItems: 'center',
  overflow: 'hidden',
  cursor: 'pointer',

  selectors: {
    '&.deleted': {
      textDecoration: 'line-through',
      color: themeVars.color.muted,
    },
  },
});

export const listItemOriginal = style({
  height: '1.5rem',
  fontFamily: fontThemeVars.monoFont,
  fontWeight: 500,
  letterSpacing: '0.025em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  padding: '5px 10px',
  borderRadius: 3,
  backgroundColor: themeVars.color.backgroundLight,
  transition: 'background-color 0.2s ease',
});

export const listItemTranslation = style({
  height: '1.5rem',
  fontFamily: fontThemeVars.baseFont,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  padding: '5px 10px',
  borderRadius: 3,
  backgroundColor: themeVars.color.backgroundLight,
  transition: 'background-color 0.2s ease',
});

export const listItemUnlinkBtn = style({});

globalStyle(
  `${listItem}:hover:not(:has(${listItemUnlinkBtn}:hover)) > ${listItemOriginal},
   ${listItem}:hover:not(:has(${listItemUnlinkBtn}:hover)) > ${listItemTranslation}`,
  {
    backgroundColor: themeVars.color.backgroundLighter,
  },
);

export const dropdown = style({
  height: 200,
  maxHeight: 200,
  display: 'flex',
  flexDirection: 'column',
  padding: 10,
});

export const dropdownSearch = style({
  paddingBottom: 10,
});

export const dropdownSuggestionsLabel = style({
  padding: 5,
  color: themeVars.color.muted,
  fontStyle: 'italic',
});
