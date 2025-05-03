import { Color } from 'models/Color';
import { PropertyType } from 'models/Property';
import { PartOfSpeech } from 'models/Word';
import { etConfig } from './et';

export enum Preset {
  Estonian = 'et',
}

export type PresetConfig = {
  name: string;
  properties: Record<PartOfSpeech, PropertyConfig[]>;
};

type PropertyConfig =
  | string
  | {
      name: string;
      type: PropertyType;
      options?: Array<{
        value: string;
        color?: Color;
      }>;
    };

export const presets: Record<Preset, PresetConfig> = {
  [Preset.Estonian]: etConfig,
};
