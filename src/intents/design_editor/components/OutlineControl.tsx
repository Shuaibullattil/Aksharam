import React, { useState } from "react";
import * as styles from "styles/components.css";
import { ColorCircle } from "./ColorCircle";
import { ColorPicker } from "./ColorPicker";
import { ParameterSlider } from "./ParameterSlider";

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
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  return (
    <>
      <div className={styles.controlGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <span>Outline</span>
        </label>
        {enabled && (
          <>
            <ParameterSlider
              label="Thickness"
              value={width}
              onChange={onWidthChange}
              min={0}
              max={10}
              trailing={
                <ColorCircle
                  color={color}
                  onClick={() => setColorPickerOpen(true)}
                />
              }
            />
          </>
        )}
      </div>

      <ColorPicker
        label="Outline Color"
        value={color}
        onChange={onColorChange}
        isOpen={colorPickerOpen}
        onClose={() => setColorPickerOpen(false)}
      />
    </>
  );
};


