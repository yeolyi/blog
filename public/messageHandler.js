let runCode = (code, log) => {
  console.log = log;

  // MEMO: 아래와 같이 js 예제 코드 중 전역에서 동작해야하는 것이 있어 Function을 사용할 수 없다.
  // var a = 1;
  // let b = 1;
  // console.log(globalThis.a, globalThis.b);
  (0, eval)(code);

  // MEMO: setTimeout등으로 코드가 실행중일 수 있어서 console.log를 되돌리면 안된다.
};

let messageHandler = (e) => {
  let postMessage = (data) => e.source.postMessage(data, '*');

  try {
    let log = (...data) => {
      postMessage({
        type: 'log',
        data: data.map((x) => stringify(x)).join(' '),
      });
    };

    runCode(e.data, log);
  } catch (e) {
    postMessage({ type: 'exception', data: e.message });
  }
};

window.addEventListener('message', messageHandler);
