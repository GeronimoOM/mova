import {
  createTheme,
  fontFace,
  globalStyle,
  keyframes,
  StyleRule,
} from '@vanilla-extract/css';
import { OptionColor } from './utils/options';

export const jostFontFace = fontFace({
  src: 'url("/fonts/Jost-VariableFont_wght.ttf") format("woff2-variations")',
  fontWeight: '125 950',
  fontStretch: '75% 125%',
  fontStyle: 'normal',
});

export const sourceCodeProFontFace = fontFace({
  src: 'url("/fonts/SourceCodePro-VariableFont_wght.ttf") format("woff2-variations")',
  fontWeight: '125 950',
  fontStretch: '75% 125%',
  fontStyle: 'normal',
});

export const verdanaFontFace = fontFace({
  src: 'url("/fonts/Verdana.ttf") format("woff2")',
});

export const themeColors = [
  'text',
  'muted',
  'background',
  'backgroundLight',
  'backgroundLighter',
  'backgroundLightest',
  'backgroundDarker',
] as const;
export type ThemeColor = (typeof themeColors)[number];

export const accentColors = [
  'primary',
  'secondary1',
  'secondary2',
  'negative',
] as const;
export type AccentColor = (typeof accentColors)[number];

export type Theme = {
  color: Record<AccentColor | ThemeColor | Lowercase<OptionColor>, string>;
  font: {
    base: string;
    mono: string;
  };
};

export const [theme, themeVars] = createTheme<Theme>({
  color: {
    text: '#f1e4f3',
    muted: '#929eb2',
    background: '#212a3b',
    backgroundLight: '#2c3546',
    backgroundLighter: '#434b5c',
    backgroundLightest: '#555f73',
    backgroundDarker: '#1a212d',

    primary: '#64a6e1',
    secondary1: '#dc5794',
    secondary2: '#8d77f0',
    negative: '#ef8354',

    red: '#fe5f55',
    orange: '#fcab10',
    yellow: '#edf060',
    green: '#2aa61c',
    teal: '#2eb39a',
    blue: '#0c71d0',
    purple: '#aa44b8',
    pink: '#ebadb8',
    brown: '#a87b3d',
  },
  font: {
    base: jostFontFace,
    mono: sourceCodeProFontFace,
  },
});

export const [defaultFontTheme, fontThemeVars] = createTheme({
  baseFont: jostFontFace,
  monoFont: sourceCodeProFontFace,
});

export const classicFontTheme = createTheme(fontThemeVars, {
  baseFont: verdanaFontFace,
  monoFont: verdanaFontFace,
});

globalStyle('html, body, #root', {
  margin: 0,
  height: '100%',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  WebkitTapHighlightColor: 'transparent',
});

globalStyle('*::-webkit-scrollbar', {
  width: 8,
});

globalStyle('*::-webkit-scrollbar-track', {
  background: themeVars.color.backgroundLight,
});

globalStyle('*::-webkit-scrollbar-thumb', {
  background: themeVars.color.backgroundLighter,
});

globalStyle('*::-webkit-scrollbar-thumb:hover', {
  background: themeVars.color.backgroundLightest,
});

globalStyle('*::selection', {
  background: themeVars.color.backgroundDarker,
});

export const notSelectable: StyleRule = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
};

export const breakpoints = {
  tiny: 'screen and (min-width: 400px)',
  small: 'screen and (min-width: 640px)',
  medium: 'screen and (min-width: 768px)',
  large: 'screen and (min-width: 1024px)',
} as const;

export const hover = {
  enabled: '(hover: hover)',
  disabled: '(hover: none',
} as const;

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const pulse = keyframes({
  '0%, 100%': {
    opacity: 1,
  },
  '50%': {
    opacity: 0.3,
  },
});

export const animations = { rotate, pulse };
