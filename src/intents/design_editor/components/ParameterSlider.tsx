import React from "react";
import * as styles from "styles/components.css";

interface ParameterSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  trailing?: React.ReactNode;
}

export const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  trailing,
}) => {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const decimals = (() => {
    const s = String(step);
    const dot = s.indexOf(".");
    return dot === -1 ? 0 : s.length - dot - 1;
  })();

  const roundToStep = (n: number) => {
    const factor = 10 ** decimals;
    return Math.round(n * factor) / factor;
  };

  const commit = (next: number) => onChange(roundToStep(clamp(next)));

  const handleRangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    if (!Number.isFinite(next)) return;
    commit(next);
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw.trim() === "" || raw === "-" || raw === ".") return;
    const next = Number(raw);
    if (!Number.isFinite(next)) return;
    commit(next);
  };

  const percent =
    max === min ? 0 : ((value - min) / (max - min)) * 100;
  const sliderStyle = {
    ["--value" as never]: `${Math.min(100, Math.max(0, percent))}%`,
  };

  return (
    <div className={styles.controlGroup}>
      <div className={styles.controlHeader}>
        <label className={styles.inputLabel}>{label}</label>
        {trailing && <div className={styles.controlTrailing}>{trailing}</div>}
      </div>

      <div className={styles.paramRow}>
        <input
          type="range"
          className={styles.sliderInput}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleRangeInput}
          style={sliderStyle}
        />

        <div className={styles.stepper}>
          <button
            type="button"
            className={styles.stepperButton}
            onClick={() => commit(value - step)}
            aria-label={`Decrease ${label}`}
            disabled={value <= min}
          >
            –
          </button>

          <input
            type="number"
            inputMode="decimal"
            className={styles.stepperInput}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleNumberInput}
            aria-label={`${label} value`}
          />

          <button
            type="button"
            className={styles.stepperButton}
            onClick={() => commit(value + step)}
            aria-label={`Increase ${label}`}
            disabled={value >= max}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
