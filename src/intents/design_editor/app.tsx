import React, { useState, useRef, useEffect } from "react";
import { useFeatureSupport } from "@canva/app-hooks";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import { toPng } from "html-to-image";
import * as styles from "styles/components.css";

import { fonts } from "./fonts";
import {
  defaultEffectsState,
  EffectsState,
  TextEffectType,
} from "./effects";
import {
  TextInput,
  FontSelector,
  SizeSlider,
  ParameterSlider,
  ColorPicker,
  ColorCircle,
  PreviewBox,
  AddButton,
} from "./components";

/**
 * Akshara Studio - Malayalam Typography Tool for Canva
 * Component-based architecture for easy UI customization
 */
export const App: React.FC = () => {
  // State management
  const [text, setText] = useState("");
  const [font, setFont] = useState<string>(fonts[0]?.name || "");
  const [size, setSize] = useState<number>(48);
  const [fontWeight, setFontWeight] = useState<number>(400);
  const [lineHeight, setLineHeight] = useState<number>(120); // percent
  const [letterSpacing, setLetterSpacing] = useState<number>(0); // px
  const [color, setColor] = useState<string>("#000000");
  const [selectedEffect, setSelectedEffect] = useState<TextEffectType>("none");
  const [effects, setEffects] = useState<EffectsState>(defaultEffectsState);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const [textColorPickerOpen, setTextColorPickerOpen] = useState<boolean>(false);
  const [shadowColorPickerOpen, setShadowColorPickerOpen] = useState<boolean>(false);
  const [spliceColorPickerOpen, setSpliceColorPickerOpen] = useState<boolean>(false);
  const [outlineColorPickerOpen, setOutlineColorPickerOpen] = useState<boolean>(false);
  const [backgroundColorPickerOpen, setBackgroundColorPickerOpen] =
    useState<boolean>(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const isSupported = useFeatureSupport();
  const addElement = [addElementAtPoint, addElementAtCursor].find((fn) =>
    isSupported(fn),
  );

  const updateEffects = (updater: (prev: EffectsState) => EffectsState) => {
    setEffects((prev) => updater(prev));
  };

  const resetEffects = () => {
    setEffects(defaultEffectsState);
  };

  const handleSelectEffect = (effect: TextEffectType) => {
    setSelectedEffect(effect);
    if (effect === "none") {
      resetEffects();
    }
  };

  // Load fonts
  useEffect(() => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setFontsLoaded(true));
    } else {
      setFontsLoaded(true);
    }
  }, []);

  // Export to Canva
  const handleAdd = async () => {
    if (!previewRef.current || !addElement) {
      return;
    }
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 3 });
      await addElement({
        type: "image",
        dataUrl,
        altText: { text: text || "Malayalam text", decorative: false },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.container}>
        {/* Text Input Component */}
        <TextInput value={text} onChange={setText} />

        {/* Font Selector Component */}
        <FontSelector value={font} onChange={setFont} />

        {/* Size Slider Component */}
        <SizeSlider value={size} onChange={setSize} />

        {/* Typography spacing + boldness (Canva-style) */}
        <ParameterSlider
          label="Line height"
          value={lineHeight}
          onChange={setLineHeight}
          min={50}
          max={300}
          step={1}
        />

        <ParameterSlider
          label="Letter spacing"
          value={letterSpacing}
          onChange={setLetterSpacing}
          min={-10}
          max={50}
          step={1}
        />

        <ParameterSlider
          label="Boldness"
          value={fontWeight}
          onChange={setFontWeight}
          min={300}
          max={800}
          step={100}
        />

        {/* Text Color Component */}
        <div className={styles.paramRow}>
          <label className={styles.inputLabel}>Text color</label>
          <ColorCircle
            color={color}
            onClick={() => setTextColorPickerOpen(true)}
          />
        </div>

        {/* Effects Section */}
        <section className={styles.effectsSection}>
          <div className={styles.effectsTitleRow}>
            <label className={styles.inputLabel}>Effects</label>
          </div>

          <div className={styles.effectsGrid}>
            {(
              [
                "none",
                "shadow",
                "lift",
                "hollow",
                "splice",
                "outline",
                "neon",
                "background",
              ] as TextEffectType[]
            ).map((effect) => {
              const isSelected = selectedEffect === effect;

              const previewStyle: React.CSSProperties = (() => {
                switch (effect) {
                  case "shadow":
                    return {
                      textShadow: "4px 4px 8px rgba(15,23,42,0.35)",
                    };
                  case "lift":
                    return {
                      textShadow: "0 10px 20px rgba(15,23,42,0.35)",
                    };
                  case "hollow":
                    return {
                      color: "transparent",
                      WebkitTextStroke: "2px #111827",
                    };
                  case "splice":
                    return {
                      WebkitTextStroke: "2px #111827",
                      textShadow: "4px 4px 0 #8B3DFF",
                    };
                  case "outline":
                    return {
                      WebkitTextStroke: "2px #8B3DFF",
                    };
                  case "neon":
                    return {
                      color: "#FFFFFF",
                      textShadow:
                        "0 0 6px rgba(139,61,255,0.9), 0 0 14px rgba(139,61,255,0.7)",
                    };
                  case "background":
                    return {
                      padding: "2px 6px",
                      borderRadius: "999px",
                      backgroundColor: "rgba(251,191,36,0.8)",
                    };
                  case "none":
                  default:
                    return {};
                }
              })();

              const name = (() => {
                switch (effect) {
                  case "none":
                    return "None";
                  case "shadow":
                    return "Shadow";
                  case "lift":
                    return "Lift";
                  case "hollow":
                    return "Hollow";
                  case "splice":
                    return "Splice";
                  case "outline":
                    return "Outline";
                  case "neon":
                    return "Neon";
                  case "background":
                    return "Background";
                  default:
                    return effect;
                }
              })();

              return (
                <div key={effect} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <button
                    type="button"
                    className={`${styles.effectCard} ${
                      isSelected ? styles.effectCardSelected : ""
                    }`}
                    onClick={() => handleSelectEffect(effect)}
                  >
                    <span className={styles.effectGlyph} style={previewStyle}>
                      അ
                    </span>
                  </button>
                  <span className={styles.effectName}>{name}</span>
                </div>
              );
            })}
          </div>

          {selectedEffect === "shadow" && (
            <>
              <ParameterSlider
                label="Offset"
                value={effects.shadow.offset}
                onChange={(value) =>
                  updateEffects((prev) => ({
                    ...prev,
                    shadow: { ...prev.shadow, offset: value },
                  }))
                }
                min={0}
                max={50}
              />
              <ParameterSlider
                label="Direction"
                value={effects.shadow.direction}
                onChange={(value) =>
                  updateEffects((prev) => ({
                    ...prev,
                    shadow: { ...prev.shadow, direction: value },
                  }))
                }
                min={0}
                max={360}
              />
              <ParameterSlider
                label="Blur"
                value={effects.shadow.blur}
                onChange={(value) =>
                  updateEffects((prev) => ({
                    ...prev,
                    shadow: { ...prev.shadow, blur: value },
                  }))
                }
                min={0}
                max={50}
              />
              <ParameterSlider
                label="Transparency"
                value={effects.shadow.transparency}
                onChange={(value) =>
                  updateEffects((prev) => ({
                    ...prev,
                    shadow: { ...prev.shadow, transparency: value },
                  }))
                }
                min={0}
                max={100}
              />
              <div className={styles.paramRow}>
                <label className={styles.inputLabel}>Shadow color</label>
                <ColorCircle
                  color={effects.shadow.color}
                  onClick={() => setShadowColorPickerOpen(true)}
                />
              </div>
            </>
          )}

          {selectedEffect === "lift" && (
            <ParameterSlider
              label="Intensity"
              value={effects.lift.intensity}
              onChange={(value) =>
                updateEffects((prev) => ({
                  ...prev,
                  lift: { ...prev.lift, intensity: value },
                }))
              }
              min={0}
              max={50}
            />
          )}

          {selectedEffect === "hollow" && (
            <ParameterSlider
              label="Thickness"
              value={effects.hollow.thickness}
              onChange={(value) =>
                updateEffects((prev) => ({
                  ...prev,
                  hollow: { ...prev.hollow, thickness: value },
                }))
              }
              min={0}
              max={20}
            />
          )}

          {selectedEffect === "splice" && (
            <>
              <ParameterSlider
                label="Thickness"
                value={effects.splice.thickness}
                onChange={(value) =>
                  updateEffects((prev) => ({
                    ...prev,
                    splice: { ...prev.splice, thickness: value },
                  }))
                }
                min={0}
                max={20}
              />
              <ParameterSlider
                label="Offset"
                value={effects.splice.offset}
                onChange={(value) =>
                  updateEffects((prev) => ({
                    ...prev,
                    splice: { ...prev.splice, offset: value },
                  }))
                }
                min={0}
                max={50}
              />
              <ParameterSlider
                label="Direction"
                value={effects.splice.direction}
                onChange={(value) =>
                  updateEffects((prev) => ({
                    ...prev,
                    splice: { ...prev.splice, direction: value },
                  }))
                }
                min={0}
                max={360}
              />
              <div className={styles.paramRow}>
                <label className={styles.inputLabel}>Splice color</label>
                <ColorCircle
                  color={effects.splice.color}
                  onClick={() => setSpliceColorPickerOpen(true)}
                />
              </div>
            </>
          )}

          {selectedEffect === "outline" && (
            <>
              <ParameterSlider
                label="Thickness"
                value={effects.outline.thickness}
                onChange={(value) =>
                  updateEffects((prev) => ({
                    ...prev,
                    outline: { ...prev.outline, thickness: value },
                  }))
                }
                min={0}
                max={20}
              />
              <div className={styles.paramRow}>
                <label className={styles.inputLabel}>Outline color</label>
                <ColorCircle
                  color={effects.outline.color}
                  onClick={() => setOutlineColorPickerOpen(true)}
                />
              </div>
            </>
          )}

          {selectedEffect === "neon" && (
            <ParameterSlider
              label="Intensity"
              value={effects.neon.intensity}
              onChange={(value) =>
                updateEffects((prev) => ({
                  ...prev,
                  neon: { ...prev.neon, intensity: value },
                }))
              }
              min={0}
              max={50}
            />
          )}

          {selectedEffect === "background" && (
            <>
              <ParameterSlider
                label="Roundness"
                value={effects.background.roundness}
                onChange={(value) =>
                  updateEffects((prev) => ({
                    ...prev,
                    background: { ...prev.background, roundness: value },
                  }))
                }
                min={0}
                max={50}
              />
              <ParameterSlider
                label="Spread"
                value={effects.background.spread}
                onChange={(value) =>
                  updateEffects((prev) => ({
                    ...prev,
                    background: { ...prev.background, spread: value },
                  }))
                }
                min={0}
                max={50}
              />
              <ParameterSlider
                label="Transparency"
                value={effects.background.transparency}
                onChange={(value) =>
                  updateEffects((prev) => ({
                    ...prev,
                    background: { ...prev.background, transparency: value },
                  }))
                }
                min={0}
                max={100}
              />
              <div className={styles.paramRow}>
                <label className={styles.inputLabel}>Background color</label>
                <ColorCircle
                  color={effects.background.color}
                  onClick={() => setBackgroundColorPickerOpen(true)}
                />
              </div>
            </>
          )}
        </section>

        {/* Preview Box Component */}
        <PreviewBox
          ref={previewRef}
          text={text}
          font={font}
          size={size}
          fontWeight={fontWeight}
          lineHeight={lineHeight}
          letterSpacing={letterSpacing}
          color={color}
          selectedEffect={selectedEffect}
          effects={effects}
          fontsLoaded={fontsLoaded}
        />

        {/* Add Button Component */}
        <AddButton
          onClick={handleAdd}
          disabled={!text || isGenerating || !addElement}
          isLoading={isGenerating}
        />
      </div>

      {/* Text Color Picker Modal */}
      <ColorPicker
        label="Text Color"
        value={color}
        onChange={setColor}
        isOpen={textColorPickerOpen}
        onClose={() => setTextColorPickerOpen(false)}
      />

      {/* Effect Color Pickers */}
      <ColorPicker
        label="Shadow Color"
        value={effects.shadow.color}
        onChange={(value) =>
          updateEffects((prev) => ({
            ...prev,
            shadow: { ...prev.shadow, color: value },
          }))
        }
        isOpen={shadowColorPickerOpen}
        onClose={() => setShadowColorPickerOpen(false)}
      />

      <ColorPicker
        label="Splice Color"
        value={effects.splice.color}
        onChange={(value) =>
          updateEffects((prev) => ({
            ...prev,
            splice: { ...prev.splice, color: value },
          }))
        }
        isOpen={spliceColorPickerOpen}
        onClose={() => setSpliceColorPickerOpen(false)}
      />

      <ColorPicker
        label="Outline Color"
        value={effects.outline.color}
        onChange={(value) =>
          updateEffects((prev) => ({
            ...prev,
            outline: { ...prev.outline, color: value },
          }))
        }
        isOpen={outlineColorPickerOpen}
        onClose={() => setOutlineColorPickerOpen(false)}
      />

      <ColorPicker
        label="Background Color"
        value={effects.background.color}
        onChange={(value) =>
          updateEffects((prev) => ({
            ...prev,
            background: { ...prev.background, color: value },
          }))
        }
        isOpen={backgroundColorPickerOpen}
        onClose={() => setBackgroundColorPickerOpen(false)}
      />
    </div>
  );
};
