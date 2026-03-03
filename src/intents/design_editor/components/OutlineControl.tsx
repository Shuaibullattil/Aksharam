import React from "react";
import * as styles from "styles/components.css";

interface OutlineControlProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  color: string;
  onColorChange: (color: string) => void;
  width: number;
  onWidthChange: (width: number) => void;
}

export const OutlineControl: React.FC<OutlineControlProps> = ({
  enabled,
  onToggle,
  color,
  onColorChange,
  width,
  onWidthChange,
}) => {
  return (
    <div className={styles.controlGroup}>
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
        />{" "}
        Outline
      </label>
      {enabled && (
        <>
          <input
            type="color"
            className={styles.colorPicker}
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
          />
          <label>Thickness: {width}px</label>
          <input
            type="range"
            min={0}
            max={10}
            value={width}
            onChange={(e) => onWidthChange(Number(e.target.value))}
          />
        </>
      )}
    </div>
  );
};
