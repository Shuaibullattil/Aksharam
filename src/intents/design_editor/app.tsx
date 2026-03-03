import React, { useState, useRef, useEffect } from "react";
import { useFeatureSupport } from "@canva/app-hooks";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import { toPng } from "html-to-image";
import * as styles from "styles/components.css";

import { fonts, FontOption } from "./fonts";

/**
 * MVP Malayalam typography tool for Canva.
 */
export const App: React.FC = () => {
  const [text, setText] = useState("");
  const [font, setFont] = useState<string>(fonts[0]?.name || "");
  const [size, setSize] = useState<number>(48);
  const [color, setColor] = useState<string>("#000000");
  const [shadowEnabled, setShadowEnabled] = useState<boolean>(false);
  const [shadowColor, setShadowColor] = useState<string>("#000000");
  const [outlineEnabled, setOutlineEnabled] = useState<boolean>(false);
  const [outlineColor, setOutlineColor] = useState<string>("#000000");
  const [outlineWidth, setOutlineWidth] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const isSupported = useFeatureSupport();
  const addElement = [addElementAtPoint, addElementAtCursor].find((fn) =>
    isSupported(fn),
  );

  useEffect(() => {
    // wait for fonts to load (CSS import already brings them in)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setFontsLoaded(true));
    } else {
      // fallback - assume ready
      setFontsLoaded(true);
    }
  }, []);

  const handleAdd = async () => {
    if (!previewRef.current || !addElement) {
      return;
    }
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 3 });
      await addElement({ type: "image", dataUrl, altText: { text: text || "Malayalam text", decorative: false } });
    } catch (err) {
      console.error(err);
      alert("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const previewStyle: React.CSSProperties = {
    fontFamily: font,
    fontSize: `${size}px`,
    color,
    textShadow: shadowEnabled
      ? `2px 2px 2px ${shadowColor}`
      : undefined,
    WebkitTextStroke: outlineEnabled
      ? `${outlineWidth}px ${outlineColor}`
      : undefined,
  };

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.container}>
        <div className={styles.controlGroup}>
          <label>Malayalam text</label>
          <textarea
            rows={3}
            style={{ width: "100%" }}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className={styles.controlGroup}>
          <label>Font</label>
          <select
            className={styles.fontSelect}
            value={font}
            onChange={(e) => setFont(e.target.value)}
          >
            {fonts.map((f) => (
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

        <div className={styles.controlGroup}>
          <label>Size: {size}px</label>
          <input
            type="range"
            min={10}
            max={200}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </div>

        <div className={styles.controlGroup}>
          <label>Text color</label>
          <input
            type="color"
            className="colorPicker"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <div className={styles.controlGroup}>
          <label>
            <input
              type="checkbox"
              checked={shadowEnabled}
              onChange={(e) => setShadowEnabled(e.target.checked)}
            />{' '}
            Shadow
          </label>
          {shadowEnabled && (
            <input
              type="color"
              value={shadowColor}
              onChange={(e) => setShadowColor(e.target.value)}
            />
          )}
        </div>

        <div className={styles.controlGroup}>
          <label>
            <input
              type="checkbox"
              checked={outlineEnabled}
              onChange={(e) => setOutlineEnabled(e.target.checked)}
            />{' '}
            Outline
          </label>
          {outlineEnabled && (
            <>
              <input
                type="color"
                value={outlineColor}
                onChange={(e) => setOutlineColor(e.target.value)}
              />
              <label>Thickness: {outlineWidth}px</label>
              <input
                type="range"
                min={0}
                max={10}
                value={outlineWidth}
                onChange={(e) => setOutlineWidth(Number(e.target.value))}
              />
            </>
          )}
        </div>

        <div className={styles.previewBox} ref={previewRef}>
          <span style={previewStyle}>
            {fontsLoaded ? text || 'നമസ്കാരം' : 'Loading fonts...'}
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={!text || isGenerating || !addElement}
        >
          {isGenerating ? 'Generating…' : 'Add to Design'}
        </button>
      </div>
    </div>
  );
};
