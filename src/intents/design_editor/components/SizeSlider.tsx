import React from "react";
import * as styles from "styles/components.css";

interface SizeSliderProps {
  value: number;
  onChange: (size: number) => void;
  min?: number;
  max?: number;
}

export const SizeSlider: React.FC<SizeSliderProps> = ({
  value,
  onChange,
  min = 10,
  max = 200,
}) => {
  return (
    <div className={styles.controlGroup}>
      <label>Size: {value}px</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
};
