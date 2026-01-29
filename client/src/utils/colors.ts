import { StyleRule } from '@vanilla-extract/css';
import {
  AccentColor,
  accentColors,
  ThemeColor,
  themeColors,
  themeVars,
} from '../index.css';
import { OptionColor, optionColors, toThemeOptionColor } from './options';

export function themeColorStyle(
  styleRule: (colorVar: string) => StyleRule,
): Record<ThemeColor, StyleRule> {
  return Object.fromEntries(
    themeColors.map((color) => [color, styleRule(themeVars.color[color])]),
  ) as Record<ThemeColor, StyleRule>;
}

export function accentColorStyle(
  styleRule: (colorVar: string) => StyleRule,
): Record<AccentColor, StyleRule> {
  return Object.fromEntries(
    accentColors.map((color) => [color, styleRule(themeVars.color[color])]),
  ) as Record<AccentColor, StyleRule>;
}

export function optionColorStyle(
  styleRule: (colorVar: string) => StyleRule,
): Record<OptionColor, StyleRule> {
  return Object.fromEntries(
    optionColors.map((color) => [
      color,
      styleRule(themeVars.color[toThemeOptionColor(color)]),
    ]),
  ) as Record<OptionColor, StyleRule>;
}

export function accentAndOptionColorStyle(
  styleRule: (colorVar: string) => StyleRule,
): Record<AccentColor | OptionColor, StyleRule> {
  return {
    ...accentColorStyle(styleRule),
    ...optionColorStyle(styleRule),
  };
}

export function themeAccentAndOptionColorStyle(
  styleRule: (colorVar: string) => StyleRule,
): Record<ThemeColor | AccentColor | OptionColor, StyleRule> {
  return {
    ...themeColorStyle(styleRule),
    ...accentColorStyle(styleRule),
    ...optionColorStyle(styleRule),
  };
}
