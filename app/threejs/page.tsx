'use client';

import GUI from 'lil-gui';
import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default function Page() {
  useEffect(() => {
    const render = script();
    let id: number | null = null;
    const f = () => {
      render();
      id = requestAnimationFrame(f);
    };
    f();
    return () => {
      id && cancelAnimationFrame(id);
    };
  }, []);

  return <canvas id="app" className="h-[100vh] w-[100vw]" />;
}

const script = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#222');

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.set(4, 5, 4);
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  const canvas = document.getElementById('app') as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({ canvas });

  const group1 = new THREE.Group();
  const material = new THREE.MeshNormalMaterial();
  material.side = THREE.DoubleSide;
  scene.add(group1);

  const plane = new THREE.PlaneGeometry(1, 4.5);

  const plane1 = new THREE.Mesh(plane, material);
  plane1.position.setY(1.75);
  plane1.position.setZ(0.5);
  group1.add(plane1);

  const plane2 = new THREE.Mesh(plane, material);
  plane2.position.setY(1.75);
  plane2.position.setX(0.5);
  plane2.rotateY(Math.PI / 2);
  group1.add(plane2);

  const plane3 = new THREE.Mesh(plane, material);
  plane3.position.setY(1.75);
  plane3.position.setX(-0.5);
  plane3.rotateY(Math.PI / 2);
  plane3.visible = false;
  group1.add(plane3);

  const plane4 = new THREE.Mesh(plane, material);
  plane4.position.setY(1.75);
  plane4.position.setZ(-0.5);
  plane4.visible = false;
  group1.add(plane4);

  const box2 = new THREE.BoxGeometry(3, 1, 1);
  const mesh2 = new THREE.Mesh(box2, material);
  mesh2.position.setX(1.5);
  group1.add(mesh2);

  const group2 = new THREE.Group();
  group2.position.setZ(-5.5);
  group2.position.setX(-5.5);
  scene.add(group2);

  const box11 = new THREE.BoxGeometry(1, 5, 1);
  const mesh11 = new THREE.Mesh(box11, material);
  mesh11.position.setY(-2);
  group2.add(mesh11);

  const box3 = new THREE.BoxGeometry(1, 1, 3.5);
  const mesh3 = new THREE.Mesh(box3, material);
  mesh3.position.setZ(1.25);
  group2.add(mesh3);

  // 고정
  const box4 = new THREE.BoxGeometry(1, 1, 3);
  const mesh4 = new THREE.Mesh(box4, material);
  mesh4.position.setZ(-4.5);
  scene.add(mesh4);

  const box5 = new THREE.BoxGeometry(3, 1, 1);
  const mesh5 = new THREE.Mesh(box5, material);
  mesh5.position.setZ(-5.5);
  mesh5.position.setX(-1);
  scene.add(mesh5);

  const handleResize = () => {
    const { innerWidth: width, innerHeight: height } = window;
    const aspectRatio = width / height;
    camera.left = -10 * aspectRatio;
    camera.right = 10 * aspectRatio;
    camera.top = 11;
    camera.bottom = -9;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  handleResize();
  window.addEventListener('resize', handleResize);

  let dragging = false;
  let x: number | null = null;

  const handleStart = () => {
    dragging = true;
    x = null;
  };

  const handleEnd = () => {
    dragging = false;

    const y = group1.rotation.y;
    const delta = Math.PI / 10;

    const target1 = Math.PI / 2;
    if (Math.abs(y - target1) <= delta) {
      group1.rotation.y = target1;
      group2.rotation.y = target1;
    }

    if (y <= delta || 2 * Math.PI - y <= delta) {
      group1.rotation.y = 0;
      group2.rotation.y = 0;
    }
  };

  const handleDrag = (offsetX: number) => {
    if (debugObj.orbitControl) return;
    if (dragging === false) return;
    if (x === null) {
      x = offsetX;
      return;
    }

    const diff = offsetX - x;
    const angle = diff / 200;

    let tmp = group1.rotation.y + angle;
    if (tmp < 0) tmp += Math.PI * 2;
    if (2 * Math.PI < tmp) tmp -= 2 * Math.PI;
    group1.rotation.y = tmp;
    group2.rotation.y = tmp;
    x = offsetX;

    plane1.visible =
      2 * Math.PI - Math.PI / 4 <= tmp || tmp <= Math.PI - Math.PI / 4;
    plane2.visible = Math.PI + Math.PI / 4 <= tmp || tmp <= Math.PI / 4;
    plane3.visible = Math.PI / 4 <= tmp && tmp <= Math.PI / 4 + Math.PI;
    plane4.visible =
      Math.PI - Math.PI / 4 <= tmp && tmp <= 2 * Math.PI - Math.PI / 4;
  };

  window.addEventListener('mousedown', handleStart);
  window.addEventListener('mouseup', handleEnd);
  window.addEventListener('mousemove', (e) => handleDrag(e.offsetX));

  window.addEventListener('touchstart', handleStart);
  window.addEventListener('touchend', handleEnd);
  window.addEventListener('touchmove', (e) => handleDrag(e.touches[0].clientX));

  // Debug
  const gui = new GUI();
  gui.close();

  const grid = new THREE.GridHelper(20, 20);
  grid.visible = false;
  scene.add(grid);

  const axesHelper = new THREE.AxesHelper(2);
  axesHelper.visible = false;
  scene.add(axesHelper);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enabled = false;

  const debugObj = {
    orbitControl: false,
    resetCamera: () => {
      camera.position.set(4, 5, 4);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
    },
  };

  gui.add(debugObj, 'orbitControl').onChange((val: boolean) => {
    controls.enabled = val;
    x = null;
  });
  gui.add(material, 'wireframe');
  gui.add(axesHelper, 'visible').name('axesHelper');
  gui.add(grid, 'visible').name('gridHelper');
  gui.add(debugObj, 'resetCamera');

  gui.add(camera.position, 'x');
  gui.add(camera.position, 'y');

  // start render
  const render = () => {
    renderer.render(scene, camera);
  };

  return render;
};
