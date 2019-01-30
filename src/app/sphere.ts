import { Ray } from './ray';
import { Surface } from './surface';
import { Thing } from './thing';
import { dot, minus, norm } from './vector';
import { Vector } from './vector';

export class Sphere implements Thing {
    public radius2: number;

    constructor(public center: Vector, radius: number, public surface: Surface) {
        this.radius2 = radius * radius;
    }

    public normal(pos: Vector): Vector {
        return norm(minus(pos, this.center));
    }

    public intersect(ray: Ray) {
        const eo = minus(this.center, ray.start);
        const v = dot(eo, ray.dir);
        let dist = 0;

        if (v >= 0) {
            const disc = this.radius2 - (dot(eo, eo) - v * v);
            if (disc >= 0) {
                dist = v - Math.sqrt(disc);
            }
        }

        return dist !== 0 ? { thing: this, ray, dist } : null;
    }
}
