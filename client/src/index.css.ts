import {
  createTheme,
  fontFace,
  globalStyle,
  keyframes,
} from '@vanilla-extract/css';

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

export const [theme, themeVars] = createTheme({
  color: {
    text: '#f1e4f3',
    primary: '#64a6e1',
    secondary1: '#dc5794',
    secondary2: '#8d77f0',
    negative: '#ef8354',
    muted: '#929eb2',
    background: '#212a3b',
    backgroundLight: '#2c3546',
    backgroundLighter: '#434b5c',
    backgroundLightest: '#555f73',
  },
});

export const colors = [
  'primary',
  'secondary1',
  'secondary2',
  'negative',
] as const;
export type Color = (typeof colors)[number];

globalStyle('html, body, #root', {
  fontFamily: jostFontFace,

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

export const breakpoints = {
  tiny: 'screen and (min-width: 400px)',
  small: 'screen and (min-width: 640px)',
  medium: 'screen and (min-width: 768px)',
  large: 'screen and (min-width: 1024px)',
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
