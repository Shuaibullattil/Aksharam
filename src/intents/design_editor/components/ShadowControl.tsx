import React, { useState } from "react";
import * as styles from "styles/components.css";
import { ColorCircle } from "./ColorCircle";
import { ColorPicker } from "./ColorPicker";
import { ParameterSlider } from "./ParameterSlider";

interface ShadowControlProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  color: string;
  onColorChange: (color: string) => void;
  offset: number;
  direction: number;
  blur: number;
  opacity: number;
  onOffsetChange: (v: number) => void;
  onDirectionChange: (v: number) => void;
  onBlurChange: (v: number) => void;
  onOpacityChange: (v: number) => void;
}

export const ShadowControl: React.FC<ShadowControlProps> = ({
  enabled,
  onToggle,
  color,
  onColorChange,
  offset,
  direction,
  blur,
  opacity,
  onOffsetChange,
  onDirectionChange,
  onBlurChange,
  onOpacityChange,
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
          <span>Shadow</span>
        </label>
        {enabled && (
          <>
            <ParameterSlider
              label="Offset"
              value={offset}
              onChange={onOffsetChange}
              min={0}
              max={200}
              trailing={
                <ColorCircle
                  color={color}
                  onClick={() => setColorPickerOpen(true)}
                />
              }
            />
            <ParameterSlider
              label="Direction"
              value={direction}
              onChange={onDirectionChange}
              min={0}
              max={360}
            />
            <ParameterSlider
              label="Blur"
              value={blur}
              onChange={onBlurChange}
              min={0}
              max={100}
            />
            <ParameterSlider
              label="Transparency"
              value={opacity}
              onChange={onOpacityChange}
              min={0}
              max={100}
            />
          </>
        )}
      </div>

      <ColorPicker
        label="Shadow Color"
        value={color}
        onChange={onColorChange}
        isOpen={colorPickerOpen}
        onClose={() => setColorPickerOpen(false)}
      />
    </>
  );
};


