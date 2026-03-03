import React, { useState, useRef, useEffect } from "react";
import * as styles from "styles/components.css";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  isOpen,
  onClose,
}) => {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [hexInput, setHexInput] = useState(value.toUpperCase());

  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hex = hslToHex(hue, saturation, lightness);
    onChange(hex);
    setHexInput(hex);
  }, [hue, saturation, lightness]);

  if (!isOpen) return null;

  const handlePickerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = pickerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const sat = Math.round((x / rect.width) * 100);
    const light = Math.round(100 - (y / rect.height) * 100);

    setSaturation(sat);
    setLightness(light);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value.toUpperCase();
    setHexInput(hex);
    if (/^#[0-9A-F]{6}$/.test(hex)) {
      onChange(hex);
    }
  };

  return (
    <>
      <div className={styles.colorPickerOverlay} onClick={onClose} />

      <div className={styles.colorPickerModal}>
        <div className={styles.colorPickerHeader}>
          <h3>{label}</h3>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.colorPickerContent}>
          
          {/* 2D Color Box */}
          <div
            ref={pickerRef}
            onClick={handlePickerClick}
            className={styles.colorBox}
            style={{
              background: `
                linear-gradient(to top, black, transparent),
                linear-gradient(to right, white, hsl(${hue}, 100%, 50%))
              `,
            }}
          >
            <div
              className={styles.colorPointer}
              style={{
                left: `${saturation}%`,
                top: `${100 - lightness}%`,
              }}
            />
          </div>

          {/* Hue Slider */}
          <input
            type="range"
            min="0"
            max="360"
            value={hue}
            onChange={(e) => setHue(parseInt(e.target.value))}
            className={styles.colorSlider}
            style={{
              background: `linear-gradient(to right,
                hsl(0,100%,50%),
                hsl(60,100%,50%),
                hsl(120,100%,50%),
                hsl(180,100%,50%),
                hsl(240,100%,50%),
                hsl(300,100%,50%),
                hsl(360,100%,50%))`,
            }}
          />

          {/* Hex Input */}
          <input
            type="text"
            value={hexInput}
            onChange={handleHexChange}
            maxLength={7}
            className={styles.colorHexInput}
          />
        </div>
      </div>
    </>
  );
};

/* HSL → HEX */
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}