import React from "react";
import * as styles from "styles/components.css";

interface PreviewBoxProps {
  ref: React.RefObject<HTMLDivElement>;
  text: string;
  font: string;
  size: number;
  color: string;
  shadowEnabled: boolean;
  shadowColor: string;
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
      color,
      shadowEnabled,
      shadowColor,
      outlineEnabled,
      outlineColor,
      outlineWidth,
      fontsLoaded,
    },
    ref
  ) => {
    const previewStyle: React.CSSProperties = {
      fontFamily: font,
      fontSize: `${size}px`,
      color,
      textShadow: shadowEnabled ? `2px 2px 2px ${shadowColor}` : undefined,
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
