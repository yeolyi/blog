import { wrapBaseHTML } from './htmlTemplate';

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

export type Preset = {
  name: PresetName;
  showConsole: boolean;
  showIframe: boolean;
  createSrcDoc: (code: string) => Promise<string>;
  language: 'javascript' | 'xml';
};

export let presetMap: { [key in PresetName]: Preset } = {
  js: {
    name: 'js',
    showConsole: true,
    showIframe: false,
    createSrcDoc: async (code) => wrapBaseHTML(`<script>${code}</script>`),
    language: 'javascript',
  },
  html: {
    name: 'html',
    showConsole: true,
    showIframe: true,
    createSrcDoc: async (code) => wrapBaseHTML(code),
    language: 'xml',
  },
  babel: {
    name: 'babel',
    showConsole: true,
    showIframe: false,
    createSrcDoc: async (code: string) => {
      return wrapBaseHTML(
        // TODO: main 브랜치로 바꾸기
        `<script src="https://cdn.jsdelivr.net/gh/yeolyi/babel-proposals-standalone@dev/index.js"></script>
      <script>
        // TODO: 왜???
        Babel.availablePlugins["transform-class-properties"] = {};
        Babel.availablePlugins["transform-object-rest-spread"] = {};
        Babel.availablePlugins["transform-flow-strip-types"] = {};
      </script>
      <script type="text/babel" data-presets="stage-0" data-type="module">${code}</script>`,
      );
    },
    language: 'javascript',
  },
  rxjs: {
    name: 'rxjs',
    showConsole: true,
    showIframe: true,
    createSrcDoc: async (code: string) => {
      return wrapBaseHTML(
        `<script src="https://unpkg.com/rxjs@^7/dist/bundles/rxjs.umd.min.js"></script>
       <script>${code}</script>`,
      );
    },
    language: 'javascript',
  },
  react: {
    name: 'react',
    showConsole: true,
    showIframe: true,
    createSrcDoc: async (code: string) => {
      return wrapBaseHTML(
        `<div id="root"></div>
      <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      <script type="text/babel">${code}</script>`,
      );
    },
    language: 'javascript',
  },
  jquery: {
    name: 'jquery',
    showConsole: true,
    showIframe: true,
    createSrcDoc: async (code) => {
      return wrapBaseHTML(
        `<script src="https://code.jquery.com/jquery-3.7.1.slim.min.js"></script>${code}`,
      );
    },
    language: 'xml',
  },
  lodash: {
    name: 'lodash',
    showConsole: true,
    showIframe: false,
    createSrcDoc: async (code) => {
      return wrapBaseHTML(
        `<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
      <script>
      let log = console.log;
      ${code}
      </script>`,
      );
    },
    language: 'javascript',
  },
};
