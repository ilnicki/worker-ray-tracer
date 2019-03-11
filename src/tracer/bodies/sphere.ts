import { Intersection } from '../intersection';
import { Ray } from '../ray';
import { Surface } from '../surfaces/surface';
import { dot, minus, norm } from '../vector';
import { Vector } from '../vector';
import { Body, BodyType } from './body';
import { BodyHandler } from './handlers';

export interface Sphere extends Body {
    type: BodyType.Sphere;
    surface: Surface;
    center: Vector;
    radius2: number;
}

export const makeSphere = (center: Vector, radius: number, surface: Surface): Sphere => ({
    type: BodyType.Sphere,
    surface,
    center,
    radius2: radius ** 2,
});

export const sphereHandler: BodyHandler<Sphere> = {
    intersect(ray: Ray, sphere: Sphere): Intersection<Sphere> {
        const eo = minus(sphere.center, ray.start);
        const v = dot(eo, ray.dir);
        let dist = 0;

        if (v >= 0) {
            const disc = sphere.radius2 - (dot(eo, eo) - v * v);
            if (disc >= 0) {
                dist = v - Math.sqrt(disc);
            }
        }

        return dist !== 0 ? { body: sphere, ray, dist } : null;
    },

    normal: (pos: Vector, sphere: Sphere): Vector => norm(minus(pos, sphere.center)),
};
