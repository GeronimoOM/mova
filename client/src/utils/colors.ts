import { StyleRule } from '@vanilla-extract/css';
import { AccentColor, accentColors, themeVars } from '../index.css';
import { OptionColor, optionColors, toThemeOptionColor } from './options';

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
