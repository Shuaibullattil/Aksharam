import React from "react";
import * as styles from "styles/components.css";

interface AddButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export const AddButton: React.FC<AddButtonProps> = ({
  onClick,
  disabled,
  isLoading,
}) => {
  return (
    <button
      className={styles.primaryButton}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? "Generating…" : "Add to Design"}
    </button>
  );
};

