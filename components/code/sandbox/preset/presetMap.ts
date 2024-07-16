import {
  Preset,
  jsPreset,
  htmlPreset,
  babelPreset,
  rxjsPreset,
  reactPreset,
  jqueryPreset,
  lodashPreset,
} from './preset';

export let presetNameList = [
  'js',
  'html',
  'rxjs',
  'babel',
  'react',
  'jquery',
  'lodash',
] as const;

export type PresetName = (typeof presetNameList)[number];

export let presetMap: { [key in PresetName]: Preset } = {
  js: jsPreset,
  html: htmlPreset,
  babel: babelPreset,
  rxjs: rxjsPreset,
  react: reactPreset,
  jquery: jqueryPreset,
  lodash: lodashPreset,
};
