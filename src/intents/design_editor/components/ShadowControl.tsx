import React from "react";
import * as styles from "styles/components.css";

interface ShadowControlProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  color: string;
  onColorChange: (color: string) => void;
}

export const ShadowControl: React.FC<ShadowControlProps> = ({
  enabled,
  onToggle,
  color,
  onColorChange,
}) => {
  return (
    <div className={styles.controlGroup}>
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
        />{" "}
        Shadow
      </label>
      {enabled && (
        <input
          type="color"
          className={styles.colorPicker}
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
        />
      )}
    </div>
  );
};
