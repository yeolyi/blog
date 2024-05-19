import * as THREE from 'three';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Base
 */
// Debug
const gui = new GUI();
gui.hide();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

/**
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

/**
 * Model
 */
const TABLE_SIDE = 5;
const MODEL_CNT = TABLE_SIDE ** 2;
const TABLE_OFFSET = 3;

let modelList = [];
let rotationOnLose = [...new Array(MODEL_CNT).keys()].map(() => [
  Math.random(),
  Math.random(),
  Math.random(),
]);

// MEMO: https://stackoverflow.com/questions/71846348/add-several-copies-of-the-same-imported-model-in-a-scene-in-three-js
const gltfLoader = new GLTFLoader();
gltfLoader.load('/duck/glTF-Binary/Duck.glb', (gltf) => {
  const model = gltf.scene;
  modelList = [...Array(MODEL_CNT).keys()].map((idx) => {
    // MEMO: clone
    const cloned = model.clone();
    const row = Math.floor(idx / TABLE_SIDE);
    const column = idx % TABLE_SIDE;

    const HALF_TABLE_SIZE = Math.floor(TABLE_SIDE / 2);
    cloned.position.setX((column - HALF_TABLE_SIZE) * TABLE_OFFSET);
    cloned.position.setY((row - HALF_TABLE_SIZE) * TABLE_OFFSET);
    cloned.rotateY(-Math.PI / 2 - 0.2);

    return cloned;
  });

  modelList.forEach((model) => scene.add(model));
});

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.9);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 2.1);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);

/**
 * Camera
 */
// Base camera
const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 100);
camera.position.z = 15;
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

/**
 * Resize
 */
// MEMO: ortho 카메라의 resize 처리
const handleResize = () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  const aspectRatio = sizes.width / sizes.height;
  camera.left = -10 * aspectRatio;
  camera.right = 10 * aspectRatio;
  camera.top = 12;
  camera.bottom = -10;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

handleResize();
window.addEventListener('resize', handleResize);

/**
 * Game
 */
let getRandomIdx = () => Math.floor(Math.random() * MODEL_CNT);
let targetIdx = getRandomIdx();

/**
 * Animate
 */
const clock = new THREE.Clock();
const INITIAL_TIMEOUT = 5;

let currentIntersect = null;
let lose = false;
let timerID = null;
let scoreTimerID = null;

let timerElement = document.getElementById('timer');
let titleElement = document.getElementById('title');
let timeElement = document.getElementById('time');

// 게임 시간 업데이트
timeElement.textContent = 'Score: 0';
let gameTime = 0;

let startTime = null;

let startScore = () => {
  startTime = Date.now();
  scoreTimerID = setInterval(() => {
    timeElement.textContent = `Score: ${++gameTime}`;
  }, [1000]);
};

let getTimeout = () => {
  let curTime = Date.now();
  let deltaSec = (curTime - startTime) / 1000;
  return INITIAL_TIMEOUT * 1.05 ** -deltaSec;
};

let setLose = () => {
  lose = true;
  titleElement.textContent = 'GAME OVER';
  clearInterval(scoreTimerID);
  clearInterval(timerID);
};

let clearTimer = () => {
  clearInterval(timerID);
};

let initTimer = () => {
  let time = getTimeout();
  const INTERVAL_MS = 100;
  let formatTime = (time) => Math.max(time, 0).toFixed(1) + 's';
  timerElement.textContent = formatTime(time);
  timerID = setInterval(() => {
    if (time <= 0) {
      setLose();
      clearTimer();
    } else {
      time -= INTERVAL_MS / 1000;
      timerElement.textContent = formatTime(time);
    }
  }, INTERVAL_MS);
};

window.addEventListener('click', () => {
  let targetModel = modelList[targetIdx];

  if (currentIntersect !== targetModel) {
    // 잘못 누름
    if (scoreTimerID === null) return;

    let quack = new Audio('quack_die.mp3');
    quack.play();

    setLose();
  } else {
    // 제대로 누름
    let quack = new Audio('quack.mp3');
    quack.play();

    if (scoreTimerID === null) startScore();

    // 타이머 초기화
    clearTimer();

    // 다음 타겟 설정
    targetIdx = getRandomIdx();

    // 타이머 설정
    initTimer();
  }
});

const SCALE_FACTOR = 1.2;

let rotateModel = (idx, delta) => {
  let model = modelList[idx];
  let [x, y, z] = rotationOnLose[idx];
  model.rotation.x += x * delta;
  model.rotation.y += y * delta;
  model.rotation.z += z * delta;
};

const tick = () => {
  const delta = clock.getDelta();

  raycaster.setFromCamera(mouse, camera);

  // 호버시 스케일
  modelList.forEach((model) => {
    model.scale.set(1, 1, 1);
  });

  currentIntersect = null;
  const intersectList = raycaster.intersectObjects(modelList);
  intersectList.forEach((intersect) => {
    // MEMO: 와 이게 맞나??
    const model = intersect.object.parent.parent;
    currentIntersect = model;
    model.scale.set(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
  });

  if (lose) {
    // 패배
    modelList.forEach((_, idx) => {
      rotateModel(idx, delta);
    });
  } else {
    // 타겟 회전
    if (modelList.length) {
      let model = modelList[targetIdx];
      model.rotation.y += delta * 0.8;
    }
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
