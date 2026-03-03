import React from "react";
import * as styles from "styles/components.css";
import { ParameterSlider } from "./ParameterSlider";

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
    <ParameterSlider
      label="Size"
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={1}
    />
  );
};

