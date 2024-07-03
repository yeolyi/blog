import {
  PresetName,
  Preset,
  jsPreset,
  htmlPreset,
  babelPreset,
  rxjsPreset,
  reactPreset,
} from './preset';

export let presetMap: { [key in PresetName]: Preset } = {
  js: jsPreset,
  html: htmlPreset,
  babel: babelPreset,
  rxjs: rxjsPreset,
  react: reactPreset,
};
