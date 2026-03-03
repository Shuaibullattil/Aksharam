import React from "react";
import * as styles from "styles/components.css";

interface PreviewBoxProps {
  ref: React.RefObject<HTMLDivElement>;
  text: string;
  font: string;
  size: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  color: string;
  shadowEnabled: boolean;
  shadowColor: string;
  shadowOffset: number;
  shadowDirection: number;
  shadowBlur: number;
  shadowOpacity: number;
  outlineEnabled: boolean;
  outlineColor: string;
  outlineWidth: number;
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
      shadowEnabled,
      shadowColor,
      shadowOffset,
      shadowDirection,
      shadowBlur,
      shadowOpacity,
      outlineEnabled,
      outlineColor,
      outlineWidth,
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

    const previewStyle: React.CSSProperties = {
      fontFamily: font,
      fontSize: `${size}px`,
      fontWeight,
      lineHeight: (lineHeight / 100).toString(),
      letterSpacing: `${letterSpacing}px`,
      color,
      whiteSpace: "pre-wrap",
      textShadow: shadowEnabled
        ? (() => {
            // convert polar offset and direction to x/y (offset in px)
            const distance = shadowOffset;
            const radians = (shadowDirection * Math.PI) / 180;
            const x = distance * Math.cos(radians);
            const y = distance * Math.sin(radians);
            const alpha = Math.min(1, Math.max(0, shadowOpacity / 100));
            const rgba = hexToRgba(shadowColor, alpha);
            return `${x.toFixed(2)}px ${y.toFixed(2)}px ${shadowBlur}px ${rgba}`;
          })()
        : undefined,
      WebkitTextStroke: outlineEnabled
        ? `${outlineWidth}px ${outlineColor}`
        : undefined,
    };

    return (
      <div className={styles.previewBox} ref={ref}>
        <span style={previewStyle}>
          {fontsLoaded ? text || "നമസ്കാരം" : "Loading fonts..."}
        </span>
      </div>
    );
  }
);

PreviewBox.displayName = "PreviewBox";
