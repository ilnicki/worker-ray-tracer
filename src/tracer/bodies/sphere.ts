import { dot, minus, norm, Vector } from '../../math/vector';
import { Ray } from '../ray';
import { Surface } from '../surfaces/surface';
import { Body, BodyType } from './body';
import { BodyHandler } from './handlers';

export interface Sphere extends Body {
    type: BodyType.Sphere;
    surface: Surface;
    center: Vector;
    radius2: number;
}

export const sphere = (center: Vector, radius: number, surface: Surface): Sphere => ({
    type: BodyType.Sphere,
    surface,
    center,
    radius2: radius ** 2,
});

export const sphereHandler: BodyHandler<Sphere> = {
    intersect(ray: Ray, sphereBody: Sphere): number {
        const eo = minus(sphereBody.center, ray.start);
        const v = dot(eo, ray.dir);
        let dist = 0;

        if (v >= 0) {
            const disc = sphereBody.radius2 - (dot(eo, eo) - v * v);
            if (disc >= 0) {
                dist = v - Math.sqrt(disc);
            }
        }

        return dist !== 0 ? dist : null;
    },

    normal: (pos: Vector, sphereBody: Sphere): Vector => norm(minus(pos, sphereBody.center)),
};
