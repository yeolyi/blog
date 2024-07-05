import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { objectCoordMap } from './coord';

export type ObjectKeys = (typeof objectKeyList)[number];

export let objectKeyList = [
  'background',
  'myComputer',
  'waffleMachine',
  'waffleMix',
  'waffle',
  'goose',
] as const;

export class ObjectManager {
  gltfLoader = new GLTFLoader();
  objectMap: { [key in ObjectKeys]?: THREE.Object3D } = {};

  constructor() {}

  async loadAll() {
    // background
    let bg = await this.gltfLoader.loadAsync(
      '/find-waffle/findwaffle_background.glb',
    );
    this.objectMap.background = bg.scene.children[0];

    // myComputer
    this.objectMap.myComputer = this.createMockCube();
  }

  get<T extends ObjectKeys>(key: T) {
    let obj = this.objectMap[key];
    if (obj === undefined) throw new ObjectNotLoadedError();
    return obj;
  }

  disposeAll() {
    // TODO
  }

  private createMockCube(color: number = 0x00ff00) {
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshBasicMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  }
}

class ObjectNotLoadedError extends Error {}
