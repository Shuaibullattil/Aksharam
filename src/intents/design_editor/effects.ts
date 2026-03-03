export type TextEffectType =
  | "none"
  | "shadow"
  | "lift"
  | "hollow"
  | "splice"
  | "outline"
  | "neon"
  | "background";

export interface ShadowEffectSettings {
  offset: number;
  direction: number;
  blur: number;
  transparency: number;
  color: string;
}

export interface LiftEffectSettings {
  intensity: number;
}

export interface HollowEffectSettings {
  thickness: number;
}

export interface SpliceEffectSettings {
  thickness: number;
  offset: number;
  direction: number;
  color: string;
}

export interface OutlineEffectSettings {
  thickness: number;
  color: string;
}

export interface NeonEffectSettings {
  intensity: number;
}

export interface BackgroundEffectSettings {
  roundness: number;
  spread: number;
  transparency: number;
  color: string;
}

export interface EffectsState {
  shadow: ShadowEffectSettings;
  lift: LiftEffectSettings;
  hollow: HollowEffectSettings;
  splice: SpliceEffectSettings;
  outline: OutlineEffectSettings;
  neon: NeonEffectSettings;
  background: BackgroundEffectSettings;
}

export const defaultEffectsState: EffectsState = {
  shadow: {
    offset: 20,
    direction: 315,
    blur: 10,
    transparency: 50,
    color: "#000000",
  },
  lift: {
    intensity: 20,
  },
  hollow: {
    thickness: 4,
  },
  splice: {
    thickness: 4,
    offset: 16,
    direction: 315,
    color: "#8B3DFF",
  },
  outline: {
    thickness: 3,
    color: "#000000",
  },
  neon: {
    intensity: 30,
  },
  background: {
    roundness: 20,
    spread: 16,
    transparency: 20,
    color: "#FFE9B5",
  },
};

