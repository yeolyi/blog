'use client';

import { useEffect } from 'react';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from 'three';

const sceneHeight = 600;
const sceneWidth = 600;

export default function ThreeJS() {
  useEffect(script, []);

  return (
    <div
      id="three"
      style={{ height: sceneHeight + 'px', width: sceneWidth + 'px' }}
      className="flex items-center justify-center"
    />
  );
}

const script = () => {
  const scene = new Scene();
  const camera = new PerspectiveCamera(75, sceneWidth / sceneHeight, 0.1, 1000);

  const renderer = new WebGLRenderer();
  renderer.setSize(sceneWidth, sceneHeight);

  const div = document.getElementById('three')!;
  div.replaceChildren(renderer.domElement);

  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0x333333 });
  const cube = new Mesh(geometry, material);

  scene.add(cube);

  camera.position.z = 5;

  const animate = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  animate();
};
