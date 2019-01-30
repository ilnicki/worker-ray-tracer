import { Camera } from './camera';
import { Light } from './light';
import { Thing } from './thing';

export interface Scene {
    things: Thing[];
    lights: Light[];
    camera: Camera;
}
