import React from "react";
import * as styles from "styles/components.css";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div className={styles.controlGroup}>
      <label>{label}</label>
      <input
        type="color"
        className={styles.colorPicker}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
