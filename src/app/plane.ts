import { always } from '../util/functional';
import { Intersection } from './intersection';
import { Ray } from './ray';
import { Surface } from './surface';
import { Thing } from './thing';
import { dot } from './vector';
import { Vector } from './vector';

export class Plane implements Thing {
    public normal: (pos: Vector) => Vector;
    public intersect: (ray: Ray) => Intersection;

    constructor(norm: Vector, offset: number, public surface: Surface) {
        this.normal = always(norm);
        this.intersect = function(ray: Ray): Intersection {
            const denom = dot(norm, ray.dir);

            if (denom > 0) {
                return null;
            } else {
                const dist = (dot(norm, ray.start) + offset) / (-denom);
                return { thing: this, ray, dist };
            }
        };
    }
}
