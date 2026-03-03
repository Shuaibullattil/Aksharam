import React from "react";

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
    <button onClick={onClick} disabled={disabled}>
      {isLoading ? "Generating…" : "Add to Design"}
    </button>
  );
};
