import React, { useState, useRef, useEffect } from "react";
import { useFeatureSupport } from "@canva/app-hooks";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import { toPng } from "html-to-image";
import * as styles from "styles/components.css";

import { fonts } from "./fonts";
import {
  TextInput,
  FontSelector,
  SizeSlider,
  ColorPicker,
  ShadowControl,
  OutlineControl,
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
        dataUrl: dataUrl,
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

        {/* Text Color Component */}
        <ColorPicker
          label="Text color"
          value={color}
          onChange={setColor}
        />

        {/* Shadow Control Component */}
        <ShadowControl
          enabled={shadowEnabled}
          onToggle={setShadowEnabled}
          color={shadowColor}
          onColorChange={setShadowColor}
        />

        {/* Outline Control Component */}
        <OutlineControl
          enabled={outlineEnabled}
          onToggle={setOutlineEnabled}
          color={outlineColor}
          onColorChange={setOutlineColor}
          width={outlineWidth}
          onWidthChange={setOutlineWidth}
        />

        {/* Preview Box Component */}
        <PreviewBox
          ref={previewRef}
          text={text}
          font={font}
          size={size}
          color={color}
          shadowEnabled={shadowEnabled}
          shadowColor={shadowColor}
          outlineEnabled={outlineEnabled}
          outlineColor={outlineColor}
          outlineWidth={outlineWidth}
          fontsLoaded={fontsLoaded}
        />

        {/* Add Button Component */}
        <AddButton
          onClick={handleAdd}
          disabled={!text || isGenerating || !addElement}
          isLoading={isGenerating}
        />
      </div>
    </div>
  );
};
