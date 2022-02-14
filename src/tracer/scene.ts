import { Body } from './bodies/body';
import { Camera } from './camera';
import { LightSource } from './light-source';

export interface Scene {
    bodies: Body[];
    lights: LightSource[];
    camera: Camera;
}
