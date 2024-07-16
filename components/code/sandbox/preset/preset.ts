import { wrapBaseHTML } from './htmlTemplate';
import { PresetName } from './presetMap';

export type Preset = {
  name: PresetName;
  showConsole: (len: number) => boolean;
  showIframe: boolean;
  createSrcDoc: (code: string) => Promise<string>;
  language: 'javascript' | 'xml';
};

let inlineScriptTag = async (urlList: string | string[]) => {
  if (typeof urlList === 'string') urlList = [urlList];
  let srcList = await Promise.all(urlList.map(fetchText));
  return srcList.map((src) => `<script>${src}</script>`).join('\n');
};

export let jsPreset: Preset = {
  name: 'js',
  showConsole: () => true,
  showIframe: false,
  createSrcDoc: async (code) => wrapBaseHTML(`<script>${code}</script>`),
  language: 'javascript',
};

export let htmlPreset: Preset = {
  name: 'html',
  showConsole: (len) => 0 < len,
  showIframe: true,
  createSrcDoc: async (code) => wrapBaseHTML(code),
  language: 'xml',
};

export let babelPreset: Preset = {
  name: 'babel',
  showConsole: () => true,
  showIframe: false,
  createSrcDoc: async (code: string) => {
    // TODO: iframe에서 캐싱하는 방법은 없나?
    return wrapBaseHTML(
      // TODO: main 브랜치로 바꾸기
      `<script>${await fetchText('https://cdn.jsdelivr.net/gh/yeolyi/babel-proposals-standalone@dev/index.js')}</script>
      <script>
        // 왜???
        Babel.availablePlugins["transform-class-properties"] = {};
        Babel.availablePlugins["transform-object-rest-spread"] = {};
        Babel.availablePlugins["transform-flow-strip-types"] = {};
      </script>
      <script type="text/babel" data-presets="stage-0" data-type="module">${code}</script>`,
    );
  },
  language: 'javascript',
};

export let rxjsPreset: Preset = {
  name: 'rxjs',
  showConsole: () => true,
  showIframe: true,
  createSrcDoc: async (code: string) => {
    return wrapBaseHTML(
      `${await inlineScriptTag('https://unpkg.com/rxjs@^7/dist/bundles/rxjs.umd.min.js')}<script>${code}</script>`,
    );
  },
  language: 'javascript',
};

export let reactPreset: Preset = {
  name: 'react',
  showConsole: () => true,
  showIframe: true,
  createSrcDoc: async (code: string) => {
    return wrapBaseHTML(
      `<div id="root"></div>
      ${await inlineScriptTag(['https://unpkg.com/react@18/umd/react.development.js', 'https://unpkg.com/react-dom@18/umd/react-dom.development.js', 'https://unpkg.com/@babel/standalone/babel.min.js'])}
      <script type="text/babel">${code}</script>`,
    );
  },
  language: 'javascript',
};

export let jqueryPreset: Preset = {
  name: 'jquery',
  showConsole: () => true,
  showIframe: true,
  createSrcDoc: async (code) => {
    return wrapBaseHTML(
      `${await inlineScriptTag('https://code.jquery.com/jquery-3.7.1.slim.min.js')}${code}`,
    );
  },
  language: 'xml',
};

export let lodashPreset: Preset = {
  name: 'lodash',
  showConsole: () => true,
  showIframe: false,
  createSrcDoc: async (code) => {
    return wrapBaseHTML(
      `${await inlineScriptTag('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js')}<script>${code}</script>`,
    );
  },
  language: 'javascript',
};

let fetchText = async (src: string) => {
  let resp = await fetch(src);
  return await resp.text();
};
