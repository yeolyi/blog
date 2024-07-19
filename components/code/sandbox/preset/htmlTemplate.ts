const stringifySrc =
  process.env.NODE_ENV === 'production'
    ? 'https://yeolyi.com/code/stringify.js'
    : 'http://localhost:3000/code/stringify.js';

export let wrapBaseHTML = (src: string) => `<!doctype html>
<html>
  <head>
    <style>
      html {
        width: 100%;
        height: 100%;
      }
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
      // https://stackoverflow.com/questions/41869122/
      // It seems Safari on IOS denies touch listeners to window 
      // unless other DOM objects also have listeners.
      document.addEventListener('click', () => {});
      document.addEventListener('touchstart', () => {});
    </script>

    <script src=${stringifySrc}></script>

    <script>
      console.log = (...data) => {
        window.parent.postMessage({
            type: 'log',
            data: data.map((x) => stringify(x)).join(' '),
        }, "*");
      }
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
    </script>
    ${src}
  </body>
</html>`;
