import React from "react";
import * as styles from "styles/components.css";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ value, onChange }) => {
  return (
    <div className={styles.controlGroup}>
      <label className={styles.inputLabel}>Malayalam text</label>
      <textarea
        className={styles.textAreaInput}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter Malayalam text here..."
      />
    </div>
  );
};

