'use client';

import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { ThreeJSScript } from './helper';
import * as THREE from 'three';
import GUI from 'lil-gui';

const debugObject = {
  subdivision: 1,
};

export const oneThree: ThreeJSScript = (canvas) => {
  const gui = new GUI({ width: 300 });

  // Scene
  const scene = new THREE.Scene();

  // Object
  const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
  const material = new THREE.MeshBasicMaterial({ color: 'royalblue' });
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);
  gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation');
  gui.add(material, 'wireframe');

  // 색은 여러 타입이 가능하기에 addColor라는 별도의 메서드로 추가
  gui.addColor(material, 'color');

  gui
    .add(debugObject, 'subdivision')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(() => {
      // Prevent memory leak
      mesh.geometry.dispose();
      mesh.geometry = new THREE.BoxGeometry(
        1,
        1,
        1,
        debugObject.subdivision,
        debugObject.subdivision,
        debugObject.subdivision,
      );
    });

  // Camera
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);

  camera.position.set(0, 10, 3);

  console.log(camera.position.length());
  console.log(mesh.position.distanceTo(camera.position));
  // console.log(camera.position.normalize());
  // mesh.scale.set(0.5, 1, 0.5);

  scene.add(camera);
  camera.lookAt(mesh.position);

  // Axes helper
  const axesHelper = new THREE.AxesHelper(2);
  scene.add(axesHelper);

  const renderer = new THREE.WebGLRenderer({ canvas });

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  // controls.target.y = 2;
  // controls.update();

  const observer = new ResizeObserver(() => {
    // Update sizes
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Update camera
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Update renderer
    // 이게 맞나?
    renderer.setSize(width, height);

    // 서로 다른 종류의 화면을 넘나드는 경우를 처리
    // 이 경우 보통 resize될 것이므로 여기서 처리
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  observer.observe(canvas);

  const clock = new THREE.Clock();
  const tick = () => {
    // How many seconds passed since clock was created.
    // const elapsedTime = clock.getElapsedTime();
    // 회전의 단위는 라디안
    // mesh.rotation.y = (Math.PI / 2) * elapsedTime;

    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };

  tick();

  canvas.style.cursor = 'pointer';
};
