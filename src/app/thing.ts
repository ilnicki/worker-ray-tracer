import { Intersection } from './intersection';
import { Ray } from './ray';
import { Surface } from './surface';
import { Vector } from './vector';

export interface Thing {
    intersect: (ray: Ray) => Intersection;
    normal: (pos: Vector) => Vector;
    surface: Surface;
}
