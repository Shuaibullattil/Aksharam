import React from "react";
import * as styles from "styles/components.css";
import {
  BackgroundEffectSettings,
  EffectsState,
  NeonEffectSettings,
  ShadowEffectSettings,
  SpliceEffectSettings,
  TextEffectType,
} from "../effects";

interface PreviewBoxProps {
  ref: React.RefObject<HTMLDivElement>;
  text: string;
  font: string;
  size: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  color: string;
  selectedEffect: TextEffectType;
  effects: EffectsState;
  fontsLoaded: boolean;
}

export const PreviewBox = React.forwardRef<HTMLDivElement, Omit<PreviewBoxProps, 'ref'>>(
  (
    {
      text,
      font,
      size,
      fontWeight,
      lineHeight,
      letterSpacing,
      color,
      selectedEffect,
      effects,
      fontsLoaded,
    },
    ref
  ) => {
    const hexToRgba = (hex: string, alpha: number) => {
      const cleaned = hex.replace("#", "").trim();
      const full =
        cleaned.length === 3
          ? cleaned
              .split("")
              .map((c) => c + c)
              .join("")
          : cleaned;
      if (!/^[0-9a-fA-F]{6}$/.test(full)) {
        return `rgba(0,0,0,${alpha})`;
      }
      const r = parseInt(full.slice(0, 2), 16);
      const g = parseInt(full.slice(2, 4), 16);
      const b = parseInt(full.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const applyShadow = (settings: ShadowEffectSettings): string => {
      const { offset, direction, blur, transparency, color: shadowColor } = settings;
      const distance = offset;
      const radians = (direction * Math.PI) / 180;
      const x = distance * Math.cos(radians);
      const y = distance * Math.sin(radians);
      const alpha = Math.min(1, Math.max(0, transparency / 100));
      const rgba = hexToRgba(shadowColor, alpha);
      return `${x.toFixed(2)}px ${y.toFixed(2)}px ${blur}px ${rgba}`;
    };

    const applyNeon = (settings: NeonEffectSettings, baseColor: string): string => {
      const intensity = settings.intensity;
      if (intensity <= 0) return "";
      const alphaBase = Math.min(1, 0.6 + intensity / 100);
      const small = `${0}px ${0}px ${intensity * 0.8}px ${hexToRgba(baseColor, alphaBase)}`;
      const medium = `${0}px ${0}px ${intensity * 1.6}px ${hexToRgba(baseColor, alphaBase * 0.7)}`;
      const large = `${0}px ${0}px ${intensity * 2.4}px ${hexToRgba(baseColor, alphaBase * 0.4)}`;
      return [small, medium, large].join(", ");
    };

    const applyBackground = (settings: BackgroundEffectSettings, baseColor: string) => {
      const { roundness, spread, transparency, color: bgColor } = settings;
      const alpha = Math.min(1, Math.max(0, (100 - transparency) / 100));
      const backgroundColor = hexToRgba(bgColor || baseColor, alpha);
      return {
        paddingInline: `${spread}px`,
        paddingBlock: `${spread / 2}px`,
        borderRadius: `${roundness}px`,
        backgroundColor,
      } as React.CSSProperties;
    };

    const applySpliceShadow = (settings: SpliceEffectSettings): string => {
      const { offset, direction, color: spliceColor } = settings;
      const distance = offset;
      const radians = (direction * Math.PI) / 180;
      const x = distance * Math.cos(radians);
      const y = distance * Math.sin(radians);
      const rgba = hexToRgba(spliceColor, 1);
      return `${x.toFixed(2)}px ${y.toFixed(2)}px 0 ${rgba}`;
    };

    const baseTextStyle: React.CSSProperties = {
      fontFamily: font,
      fontSize: `${size}px`,
      fontWeight,
      lineHeight: (lineHeight / 100).toString(),
      letterSpacing: `${letterSpacing}px`,
      color,
      whiteSpace: "pre-wrap",
    };

    const wrapperStyle: React.CSSProperties = {
      display: "inline-block",
    };

    const styleForEffect = (): {
      wrapper: React.CSSProperties;
      text: React.CSSProperties;
    } => {
      switch (selectedEffect) {
        case "shadow": {
          const textShadow = applyShadow(effects.shadow);
          return {
            wrapper: wrapperStyle,
            text: {
              ...baseTextStyle,
              textShadow,
            },
          };
        }
        case "lift": {
          const intensity = effects.lift.intensity;
          const y = intensity;
          const blur = intensity * 2;
          const shadow = `0 ${y}px ${blur}px rgba(15, 23, 42, 0.35)`;
          return {
            wrapper: wrapperStyle,
            text: {
              ...baseTextStyle,
              textShadow: shadow,
            },
          };
        }
        case "hollow": {
          const thickness = effects.hollow.thickness;
          return {
            wrapper: wrapperStyle,
            text: {
              ...baseTextStyle,
              color: "transparent",
              WebkitTextStroke: `${thickness}px ${color}`,
            },
          };
        }
        case "splice": {
          const { thickness } = effects.splice;
          const spliceShadow = applySpliceShadow(effects.splice);
          return {
            wrapper: wrapperStyle,
            text: {
              ...baseTextStyle,
              WebkitTextStroke: `${thickness}px ${color}`,
              textShadow: spliceShadow,
            },
          };
        }
        case "outline": {
          const { thickness, color: outlineColor } = effects.outline;
          return {
            wrapper: wrapperStyle,
            text: {
              ...baseTextStyle,
              color,
              WebkitTextStroke: `${thickness}px ${outlineColor}`,
            },
          };
        }
        case "neon": {
          const neonShadow = applyNeon(effects.neon, color);
          return {
            wrapper: wrapperStyle,
            text: {
              ...baseTextStyle,
              color: "#FFFFFF",
              textShadow: neonShadow,
            },
          };
        }
        case "background": {
          const bg = applyBackground(effects.background, color);
          const mergedWrapper = {
            ...wrapperStyle,
            ...bg,
          };
          return {
            wrapper: mergedWrapper,
            text: {
              ...baseTextStyle,
            },
          };
        }
        case "none":
        default:
          return {
            wrapper: wrapperStyle,
            text: baseTextStyle,
          };
      }
    };

    const { wrapper, text: previewStyle } = styleForEffect();

    return (
      <div className={styles.previewBox} ref={ref}>
        <span style={wrapper}>
          <span style={previewStyle}>
            {fontsLoaded ? text || "നമസ്കാരം" : "Loading fonts..."}
          </span>
        </span>
      </div>
    );
  }
);

PreviewBox.displayName = "PreviewBox";
