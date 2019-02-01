import { Body, BodyHandler, BodyHandlerId } from './body';
import { Intersection } from './intersection';
import { Ray } from './ray';
import { SurfaceId } from './surface';
import { dot, minus, norm } from './vector';
import { Vector } from './vector';

export interface Sphere extends Body {
    handlerId: 'sphere';
    surfaceId: SurfaceId;
    center: Vector;
    radius2: number;
}

export const makeSphere = (center: Vector, radius: number, surfaceId: SurfaceId): Sphere => ({
    handlerId: 'sphere',
    surfaceId,
    center,
    radius2: radius ** 2,
});

export const SphereHandler: BodyHandler<Sphere> = {
    intersect(ray: Ray, sphere: Sphere): Intersection {
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
