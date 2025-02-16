import { style } from "@vanilla-extract/css";
import { themeVars } from "../../index.css";

export const backdrop = style({
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(2px)',
});

export const modal = style({
    border: `2px solid ${themeVars.color.text}`,
    borderRadius: '4px',
    padding: '10px',
    backgroundColor: `${themeVars.color.background}`,
});