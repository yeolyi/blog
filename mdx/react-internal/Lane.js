'use client';

import { useRef, useState, useTransition } from 'react';

// React Fiber 트리에 접근하기 위한 유틸리티 함수
function getFiberNode(element) {
  const key = Object.keys(element).find(
    (key) =>
      key.startsWith('__reactInternalInstance$') ||
      key.startsWith('__reactFiber$'),
  );
  console.log(Object.keys(element));
  // const div = document.createElement('div');
  // console.log(Object.keys(div));
  return element[key];
}

function getRootNode(fiber) {
  let currentFiber = fiber;
  while (
    currentFiber.return &&
    currentFiber &&
    !(currentFiber.type && currentFiber.type.name === 'App')
  ) {
    currentFiber = currentFiber.return;
  }
  return currentFiber;
}

// Fiber 트리의 lane과 childLane 값을 출력하는 함수
function printLaneInfo(fiber) {
  function traverse(node, depth = 0) {
    if (!node) return;

    const indent = ' '.repeat(depth * 2);
    const componentName = node.type?.name || node.type || 'HostComponent';
    console.log(indent, componentName, node.lanes, node.childLanes);

    // 자식 노드 순회
    let child = node.child;
    while (child) {
      traverse(child, depth + 1);
      child = child.sibling;
    }
  }

  traverse(fiber);
}

function Link() {
  return <a href="https://jser.dev">jser.dev</a>;
}

function Component() {
  const [count, setCount] = useState(0);
  const buttonRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  const helper = (trigger) => () => {
    trigger();

    if (!buttonRef) return;

    const buttonFiber = getFiberNode(buttonRef.current);
    if (!buttonFiber) return;

    const rootFiber = getRootNode(buttonFiber);
    if (!rootFiber) return;

    printLaneInfo(rootFiber);
  };

  return (
    <div>
      <Button onClick={helper(() => setCount((x) => x + 1))} ref={buttonRef}>
        setState - {count}
      </Button>{' '}
      <Button
        onClick={helper(() => startTransition(() => setCount((x) => x + 1)))}
        ref={buttonRef}
      >
        useTransition - {count}
      </Button>
      {/* ({count % 2 === 0 ? <span>even</span> : <b>odd</b>}) */}
    </div>
  );
}

const Button = (props) => (
  <button
    type="button"
    className="cursor-pointer border-2 border-white p-2"
    {...props}
  />
);

export default function App() {
  return (
    <div className="border-white border-2 p-4">
      <Link />
      <br />
      <Component />
    </div>
  );
}
