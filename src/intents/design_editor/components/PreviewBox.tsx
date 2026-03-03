import React from "react";
import * as styles from "styles/components.css";
import { EffectsState, TextEffectType } from "../effects";

interface PreviewBoxProps {
  ref: React.RefObject<HTMLDivElement>;
  text: string;
  font: string;
  size: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  color: string;
  selectedEffect: TextEffectType;
  effects: EffectsState;
  fontsLoaded: boolean;
}

const SVG_WIDTH = 400;
const SVG_HEIGHT = 160;

export const PreviewBox = React.forwardRef<
  HTMLDivElement,
  Omit<PreviewBoxProps, "ref">
>(
  (
    {
      text,
      font,
      size,
      fontWeight,
      lineHeight,
      letterSpacing,
      color,
      selectedEffect,
      effects,
      fontsLoaded,
    },
    ref,
  ) => {
    const content = fontsLoaded ? text || "നമസ്കാരം" : "Loading fonts...";
    const lines = content.split(/\r?\n/);

    const lineHeightPx = size * (lineHeight / 100);
    const totalHeight = lineHeightPx * Math.max(lines.length, 1);
    const startY = SVG_HEIGHT / 2 - totalHeight / 2 + lineHeightPx * 0.8;

    const baseTextProps = {
      fontFamily: font,
      fontSize: size,
      fontWeight,
      letterSpacing,
      textAnchor: "middle" as const,
      dominantBaseline: "alphabetic" as const,
    };

    const polarToCartesian = (distance: number, angleDeg: number) => {
      const radians = (angleDeg * Math.PI) / 180;
      return {
        x: distance * Math.cos(radians),
        y: distance * Math.sin(radians),
      };
    };

    const generateEffectSvg = () => {
      const centerX = SVG_WIDTH / 2;

      const renderLines = (
        opts: {
          fill?: string;
          stroke?: string;
          strokeWidth?: number;
          filterId?: string;
        } = {},
      ) => (
        <text
          x={centerX}
          y={startY}
          fill={opts.fill ?? color}
          stroke={opts.stroke}
          strokeWidth={opts.strokeWidth}
          filter={opts.filterId ? `url(#${opts.filterId})` : undefined}
          {...baseTextProps}
        >
          {lines.map((line, index) => (
            <tspan
              key={index}
              x={centerX}
              dy={index === 0 ? 0 : lineHeightPx}
            >
              {line}
            </tspan>
          ))}
        </text>
      );

      const defs: React.ReactNode[] = [];

      let contentNode: React.ReactNode = renderLines();
      let backgroundNode: React.ReactNode = null;

      switch (selectedEffect) {
        case "outline": {
          const { thickness, color: strokeColor } = effects.outline;
          contentNode = renderLines({
            fill: color,
            stroke: strokeColor,
            strokeWidth: thickness,
          });
          break;
        }

        case "hollow": {
          const { thickness } = effects.hollow;
          contentNode = renderLines({
            fill: "transparent",
            stroke: color,
            strokeWidth: thickness,
          });
          break;
        }

        case "shadow": {
          const { offset, direction, blur, transparency, color: shadowColor } =
            effects.shadow;
          const { x, y } = polarToCartesian(offset, direction);
          const opacity = Math.max(0, Math.min(1, (100 - transparency) / 100));
          const filterId = "shadowEffect";

          defs.push(
            <filter
              id={filterId}
              key={filterId}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx={x}
                dy={y}
                stdDeviation={blur}
                floodColor={shadowColor}
                floodOpacity={opacity}
              />
            </filter>,
          );

          contentNode = renderLines({
            fill: color,
            filterId,
          });
          break;
        }

        case "lift": {
          const { intensity } = effects.lift;
          const filterId = "liftEffect";

          defs.push(
            <filter
              id={filterId}
              key={filterId}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx={0}
                dy={intensity}
                stdDeviation={intensity * 2}
                floodColor="#111827"
                floodOpacity={0.35}
              />
            </filter>,
          );

          contentNode = renderLines({
            fill: color,
            filterId,
          });
          break;
        }

        case "splice": {
          const { thickness, offset, direction, color: spliceColor } =
            effects.splice;
          const { x, y } = polarToCartesian(offset, direction);

          const bottom = (
            <text
              key="splice-bottom"
              x={centerX + x}
              y={startY + y}
              fill={spliceColor}
              {...baseTextProps}
            >
              {lines.map((line, index) => (
                <tspan
                  key={index}
                  x={centerX + x}
                  dy={index === 0 ? 0 : lineHeightPx}
                >
                  {line}
                </tspan>
              ))}
            </text>
          );

          const top = renderLines({
            fill: color,
            stroke: color,
            strokeWidth: thickness,
          });

          contentNode = (
            <>
              {bottom}
              {top}
            </>
          );
          break;
        }

        case "neon": {
          const { intensity } = effects.neon;
          const filterId = "neonEffect";
          const blurSmall = intensity * 0.6;
          const blurMedium = intensity * 1.2;
          const blurLarge = intensity * 2;

          defs.push(
            <filter
              id={filterId}
              key={filterId}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={blurSmall}
                result="blur1"
              />
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={blurMedium}
                result="blur2"
              />
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={blurLarge}
                result="blur3"
              />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="blur3" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>,
          );

          contentNode = renderLines({
            fill: "#FFFFFF",
            stroke: color,
            strokeWidth: 1.5,
            filterId,
          });
          break;
        }

        case "background": {
          const {
            roundness,
            spread,
            transparency,
            color: backgroundColor,
          } = effects.background;
          const opacity = Math.max(
            0,
            Math.min(1, (100 - transparency) / 100),
          );

          const paddingX = spread;
          const paddingY = spread / 2;
          const rectWidth = SVG_WIDTH - paddingX * 2;
          const rectHeight = totalHeight + paddingY * 2;
          const rectX = (SVG_WIDTH - rectWidth) / 2;
          const rectY = (SVG_HEIGHT - rectHeight) / 2;

          backgroundNode = (
            <rect
              x={rectX}
              y={rectY}
              width={rectWidth}
              height={rectHeight}
              rx={roundness}
              ry={roundness}
              fill={backgroundColor}
              fillOpacity={opacity}
            />
          );

          contentNode = renderLines({
            fill: color,
          });
          break;
        }

        case "none":
        default: {
          contentNode = renderLines({
            fill: color,
          });
        }
      }

      return (
        <svg
          width="100%"
          height={SVG_HEIGHT}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>{defs}</defs>
          {backgroundNode}
          {contentNode}
        </svg>
      );
    };

    return (
      <div className={styles.previewBox} ref={ref}>
        {generateEffectSvg()}
      </div>
    );
  },
);

PreviewBox.displayName = "PreviewBox";
