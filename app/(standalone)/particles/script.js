import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Base
 */
const side = 10;

// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x78a7ff);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTextures = [...Array(4).keys()].map((idx) =>
  textureLoader.load(`/textures/particles/snow${idx}.png`),
);

const grassTexture = textureLoader.load('/textures/particles/grass.jpeg');
grassTexture.colorSpace = THREE.SRGBColorSpace;
grassTexture.repeat.set(100, 100);
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;

const grass = new THREE.Mesh(
  new THREE.PlaneGeometry(side * 10, side * 10),
  new THREE.MeshStandardMaterial({ map: grassTexture }),
);
grass.rotation.x = -Math.PI * 0.5;
grass.position.y = -side / 2;
scene.add(grass);

/**
 * Particles
 */

// Material
const particlesMaterials = [...Array(4).keys()].map((idx) => {
  const texture = particleTextures[idx];

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    sizeAttenuation: true,
  });

  particlesMaterial.map = texture;
  particlesMaterial.transparent = true;
  particlesMaterial.alphaMap = texture;
  particlesMaterial.depthWrite = false;
  particlesMaterial.blending = THREE.AdditiveBlending;

  return particlesMaterial;
});

// Geometry
const count = 1200;

let particleSpeed = [...Array(count * 4).keys()].map(
  () => Math.random() / 10 + 0.08,
);
let particleX = [...Array(count * 4).keys()].map(
  () => (Math.PI * Math.random()) / 5,
);
let particleZ = [...Array(count * 4).keys()].map(
  () => (Math.PI * Math.random()) / 5,
);

const particlesGeometries = [...Array(4).keys()].map((idx) => {
  const particlesGeometry = new THREE.BufferGeometry();

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * side;
  }

  particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3),
  );

  return particlesGeometry;
});

// Points
const particles = [...Array(4).keys()].map(
  (idx) => new THREE.Points(particlesGeometries[idx], particlesMaterials[idx]),
);

particles.forEach((x) => scene.add(x));

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 1);
scene.add(ambientLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.y = -3;
camera.position.z = -3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target = new THREE.Vector3(0, -3, 0);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

let debug = { d: 1 };
gui.add(debug, 'd').min(0.1).max(10);

const tick = () => {
  const delta = clock.getDelta() * debug.d;

  for (let i = 0; i < 4; i++) {
    const geometry = particlesGeometries[i];
    for (let j = 0; j < count; j++) {
      const particleIdx = i * count + j;
      const speed = particleSpeed[particleIdx];

      const xIdx = j * 3;
      const yIdx = j * 3 + 1;
      const zIdx = j * 3 + 2;

      let x = geometry.attributes.position.array[xIdx];
      let y = geometry.attributes.position.array[yIdx];
      let z = geometry.attributes.position.array[zIdx];

      let yDelta = delta * speed;
      y -= yDelta;

      let xMul = particleX[particleIdx];
      x += xMul * yDelta;
      let zMul = particleZ[particleIdx];
      z += zMul * yDelta;

      if (y < -side / 2) y = side / 2;

      if (x < -side / 2) x = side / 2;
      if (side / 2 < x) x = -side / 2;
      if (z < -side / 2) z = side / 2;
      if (side / 2 < z) z = -side / 2;

      geometry.attributes.position.array[xIdx] = x;
      geometry.attributes.position.array[yIdx] = y;
      geometry.attributes.position.array[zIdx] = z;
    }
    geometry.attributes.position.needsUpdate = true;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
