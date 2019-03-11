import { Body } from './bodies/body';
import { Camera } from './camera';
import { Light } from './light';

export interface Scene {
    bodies: Body[];
    lights: Light[];
    camera?: Camera;
}
