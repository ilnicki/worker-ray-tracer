import { Color } from '../../math/color';
import { Vector } from '../../math/vector';
import { Surface } from './surface';

export interface SurfaceHandler<T extends Surface = Surface> {
    diffuse: (surface: T, pos: Vector) => Color;
    specular: (surface: T, pos: Vector) => Color;
    reflect: (surface: T, pos: Vector) => number;
    roughness: (surface: T, pos: Vector) => number;
}
