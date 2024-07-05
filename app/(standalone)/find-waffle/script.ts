import * as THREE from 'three';
import { ObjectManager } from './object';
import { cameraCoord, objectCoordMap } from './coord';
import { EventHandlerManager } from './EventHandlerManager';
import {
  CAMERA_DRAG_DENOM,
  CAMERA_HEIGHT,
  CAMERA_RADIUS,
  CAMERA_ZOOM,
} from './constant';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export let run = () => {
  const canvas = document.querySelector('canvas')!;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50); // TODO: 무슨 카메라를 쓸지
  const renderer = new THREE.WebGLRenderer({ canvas });
  const objManager = new ObjectManager();
  const raycaster = new THREE.Raycaster();
  const eventManager = new EventHandlerManager();

  // Add camera to scene
  scene.add(camera);
  camera.position.set(0, CAMERA_HEIGHT, 0);
  camera.lookAt(new THREE.Vector3(1, CAMERA_HEIGHT, 0));

  addResizeHandler(camera, renderer);

  // raycaster
  let pointer = new THREE.Vector2();
  addEventListener('pointermove', ({ clientX, clientY }) => {
    pointer.x = (clientX / innerWidth) * 2 - 1;
    pointer.y = -(clientY / innerHeight) * 2 + 1;
  });

  // dispose
  let disposed = false;

  let dispose = () => {
    disposed = true;
    eventManager.disposeAll();
    objManager.disposeAll();
  };

  (async () => {
    await objManager.loadAll();
    // 모든 비동기 작업은 disposed 위에서?
    if (disposed) return;

    // Add objects
    let light = new THREE.AmbientLight('white');
    scene.add(light);

    scene.add(objManager.get('background'));

    let window1 = createVirtualWindow();
    window1.position.copy(objectCoordMap.window1);
    window1.lookAt(camera.position);
    scene.add(window1);

    let myComputer = objManager.get('myComputer');
    myComputer.position.copy(objectCoordMap.myComputer);
    myComputer.lookAt(camera.position);
    scene.add(myComputer);

    let window2 = createVirtualWindow();
    window2.position.copy(objectCoordMap.window2);
    window2.lookAt(camera.position);
    scene.add(window2);

    // Add bg drag handler
    eventManager.addEventListener('mousedown', (e) => {
      let bg = objManager.get('background');
      let isIntersect = 0 < raycaster.intersectObject(myComputer).length;
      if (isIntersect) {
        let mouseMoveHandler = (e: MouseEvent) => {
          let intersectionList = raycaster.intersectObject(window1);
          if (intersectionList.length === 0) return;

          let intersection = intersectionList[0].point;
          myComputer.position.copy(intersection);
          myComputer.lookAt(camera.position);

          // remove on mouseup
          eventManager.addEventListener('mouseup', (e) => {
            eventManager.removeEventListener('mousemove', mouseMoveHandler);
          });
        };

        eventManager.addEventListener('mousemove', mouseMoveHandler);

        return;
      }

      isIntersect = 0 < raycaster.intersectObject(bg).length;
      if (isIntersect) {
        let prevX = e.clientX;

        let mouseMoveHandler = (e: MouseEvent) => {
          let curX = e.clientX;
          let delta = (curX - prevX) / CAMERA_DRAG_DENOM;
          prevX = curX;

          let dir = new THREE.Vector3();
          camera.getWorldDirection(dir);

          let angle = (Math.atan2(dir.z, dir.x) * 180) / Math.PI;
          if ((0 < delta && angle < 0) || (delta < 0 && 90 < angle)) return;

          camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), delta);

          // remove on mouseup
          eventManager.addEventListener('mouseup', (e) => {
            eventManager.removeEventListener('mousemove', mouseMoveHandler);
          });
        };

        eventManager.addEventListener('mousemove', mouseMoveHandler);
      }
    });

    // start loop
    let tick = () => {
      renderer.render(scene, camera);
      raycaster.setFromCamera(pointer, camera);
      eventManager.requestAnimationFrame(tick);
    };

    tick();
  })();

  // DEBUG
  // new OrbitControls(camera, canvas);

  // const gridHelper = new THREE.GridHelper(50);
  // scene.add(gridHelper);

  scene.add(new THREE.AxesHelper(100));

  return dispose;
};

let addResizeHandler = (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
) => {
  let handleResize = () => {
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    camera.updateProjectionMatrix();
  };

  addEventListener('resize', handleResize);
  handleResize();
};

let createVirtualWindow = () => {
  const geometry = new THREE.PlaneGeometry(20, 20);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.FrontSide,
    opacity: 0.3,
    transparent: true,
  });
  let mesh = new THREE.Mesh(geometry, material);

  return mesh;
};
