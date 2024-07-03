import { stringifySrc } from './stringify';

export type PresetName = 'js' | 'html' | 'rxjs' | 'babel';

export type Preset = {
  name: PresetName;
  showConsole: (len: number) => boolean;
  showIframe: boolean;
  createSrcDoc: (code: string) => Promise<string>;
  language: 'javascript' | 'xml';
};

export let jsPreset: Preset = {
  name: 'js',
  showConsole: () => true,
  showIframe: false,
  createSrcDoc: async (code) =>
    `${srcdocHead}<script>${code}</script>${srcdocTail}`,
  language: 'javascript',
};

export let htmlPreset: Preset = {
  name: 'html',
  showConsole: (len) => 0 < len,
  showIframe: true,
  createSrcDoc: async (code) => `${srcdocHead}${code}${srcdocTail}`,
  language: 'xml',
};

export let babelPreset: Preset = {
  name: 'babel',
  showConsole: () => true,
  showIframe: false,
  createSrcDoc: async (code: string) => {
    // TODO: iframe에서 캐싱하는 방법은 없나?
    return (
      srcdocHead +
      `<script>${await fetchText('https://unpkg.com/@babel/standalone/babel.min.js')}</script>
    <script>
      Babel.registerPreset("env-plus", {
        plugins: [
          [Babel.availablePlugins["proposal-decorators"], { version: '2023-11' }],
          [Babel.availablePlugins["proposal-throw-expressions"], { version: '2023-11' }],
          [Babel.availablePlugins["proposal-pipeline-operator"], { proposal: 'hack', topicToken: '@@' }],
        ],
      });
    </script>
    <script type="text/babel" data-presets="env-plus">` +
      code +
      '</script>' +
      srcdocTail
    );
  },
  language: 'javascript',
};

export let rxjsPreset: Preset = {
  name: 'rxjs',
  showConsole: () => true,
  showIframe: true,
  createSrcDoc: async (code: string) => {
    let src = await fetchText(
      'https://unpkg.com/rxjs@^7/dist/bundles/rxjs.umd.min.js',
    );
    return `${srcdocHead}<script>${src}</script><script>${code}</script>${srcdocTail}`;
  },
  language: 'javascript',
};

let fetchText = async (src: string) => {
  let resp = await fetch(src);
  return await resp.text();
};

let srcdocHead = `<!doctype html>
<html>
  <head>
    <style>
      body {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 8px;
      }
    </style>
  </head>
  <body>
    <script>
      ${stringifySrc}

      console.log = (...data) => {
        window.parent.postMessage({
            type: 'log',
            data: data.map((x) => stringify(x)).join(' '),
        }, "*");
      }
    </script>

    <script type="module">
      let resizeObserver = new ResizeObserver(entries => {
        window.parent.postMessage({
          type: 'height',
          // TODO: 해결하기 귀찮아서 넣은 여유값 없애기
          data: document.body.scrollHeight + 2 + 'px',
        }, "*");
      })

      resizeObserver.observe(document.body);
    </script>

    <script>
      // 잡히지 않은 에러가 콘솔에 뜨지 않도록 합니다.

      // MEMO: type="module"이면 async 에러만 잡힌다.
      // 마이크로 큐가 문서 파싱 끝나고 도는건가? 신기방기
      addEventListener('error', (e) => {
        parent.postMessage({ 
          type: 'exception', 
          data: e.message
        }, "*");
      });

      addEventListener('unhandledrejection', (e) => {
        parent.postMessage({
          type: 'exception',
          data: e.reason.message
        }, "*");
      });
    </script>`;

let srcdocTail = `</body>
</html>`;

export let presetMap: Map<PresetName, Preset> = new Map([
  ['js', jsPreset],
  ['html', htmlPreset],
  ['babel', babelPreset],
  ['rxjs', rxjsPreset],
]);
