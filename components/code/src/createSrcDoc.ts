import { stringifySrc } from './stringify';

export let createSrcDoc = (code: string, type: 'html' | 'js' | 'babel') => {
  switch (type) {
    case 'html':
      return _createSrcDoc(code);
    case 'js':
      return _createSrcDoc(`<script>${code}</script>`);
    case 'babel':
      return _createSrcDoc(`
<div id="output"></div>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script>
        
  // Define a preset
  Babel.registerPreset("env-plus", {
    plugins: [
      [Babel.availablePlugins["proposal-decorators"], { version: '2023-11' }],
      [Babel.availablePlugins["proposal-throw-expressions"], { version: '2023-11' }],
      [Babel.availablePlugins["proposal-pipeline-operator"], { proposal: 'hack', topicToken: '@@' }],
    ],
  });
</script>
<script type="text/babel" data-presets="env-plus">
      ${code}
</script>
`);
  }
};

let _createSrcDoc = (bodyContent: string) => `<!doctype html>
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
      // MEMO: type="module"이면 async 에러만 잡힌다.
      // 마이크로 큐가 문서 파싱 끝나고 도는건가? 신기방기
      // 잡히지 않은 에러가 콘솔에 뜨지 않도록 합니다.
      addEventListener('error', (e) => {
        console.info(e);
        parent.postMessage({ 
          type: 'exception', 
          data: e.message
        }, "*");
        e.preventDefault();
      });

      addEventListener('unhandledrejection', (e) => {
        parent.postMessage({
          type: 'exception',
          data: e.message
        }, "*");
        e.preventDefault();
      });
    </script>

    ${bodyContent}
  </body>
</html>
`;
