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

      // 잡히지 않은 에러가 콘솔에 뜨지 않도록 합니다.
      window.addEventListener('error', (e) => {
        window.parent.postMessage({ 
          type: 'exception', 
          data: \`에러: \${e.message}\` 
        }, "*");
        e.preventDefault();
      });

      window.addEventListener('unhandledrejection', (e) => {
        window.parent.postMessage({
          type: 'exception',
          data: \`비동기 에러: \${e.message}\`,
        }, "*");
        e.preventDefault();
      });
    </script>
    <script defer>
      let resizeObserver = new ResizeObserver(entries => {
        window.parent.postMessage({
          type: 'height',
          data: document.body.scrollHeight + 'px',
        }, "*");
      })

      resizeObserver.observe(document.body);
    </script>

    ${bodyContent}
  </body>
</html>
`;
