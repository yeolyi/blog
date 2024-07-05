import { Vector3 } from 'three';
import { ObjectKeys } from './object';
import { CAMERA_HEIGHT } from './constant';

export let objectCoordMap = {
  background: new Vector3(0, 0, 0),
  myComputer: new Vector3(20, CAMERA_HEIGHT, 0),
  waffleMachine: new Vector3(0, 0, 0),
  waffleMix: new Vector3(0, 0, 0),
  waffle: new Vector3(0, 0, 0),
  goose: new Vector3(0, 0, 0),
  window1: new Vector3(20, CAMERA_HEIGHT, 0),
  window2: new Vector3(0, CAMERA_HEIGHT, 20),
} as const;

export let cameraCoord = new Vector3(0, 0, 0);
