import { Ray } from '../ray';
import { Surface } from '../surfaces/surface';
import { dot, norm } from '../vector';
import { Vector } from '../vector';
import { Body, BodyType } from './body';
import { BodyHandler } from './handlers';

export interface Plane extends Body {
    type: BodyType.Plane;
    surface: Surface;
    normal: Vector;
    offset: number;
}

export const plane = (normal: Vector, offset: number, surface: Surface): Plane => ({
    type: BodyType.Plane,
    surface,
    normal: norm(normal),
    offset,
});

export const planeHandler: BodyHandler<Plane> = {
    intersect(ray: Ray, planeBody: Plane): number {
        const denom = dot(planeBody.normal, ray.dir);
        return denom > 0 ? null : (dot(planeBody.normal, ray.start) + planeBody.offset) / -denom;
    },

    normal: (_pos: Vector, planeBody: Plane): Vector => planeBody.normal,
};
