import React from "react";
import { fonts, FontOption } from "../fonts";
import * as styles from "styles/components.css";

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className={styles.controlGroup}>
      <label>Font</label>
      <select
        className={styles.fontSelect}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {fonts.map((f: FontOption) => (
          <option
            key={f.name}
            value={f.name}
            style={{ fontFamily: f.name }}
          >
            {`നമസ്കാരം (${f.name})`}
          </option>
        ))}
      </select>
    </div>
  );
};
