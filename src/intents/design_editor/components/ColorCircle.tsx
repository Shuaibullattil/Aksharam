import React from "react";
import * as styles from "styles/components.css";

interface ColorCircleProps {
  color: string;
  onClick: () => void;
  label?: string;
}

export const ColorCircle: React.FC<ColorCircleProps> = ({
  color,
  onClick,
  label,
}) => {
  return (
    <div className={styles.colorCircleContainer}>
      {label && <span className={styles.colorCircleLabel}>{label}</span>}
      <button
        className={styles.colorCircle}
        style={{ backgroundColor: color }}
        onClick={onClick}
        title={color}
      />
    </div>
  );
};
