import { Surface } from '../surfaces/surface';

export interface Body {
    surface: Surface;
    type: BodyType;
}

export enum BodyType {
    Plane,
    Sphere,
}
