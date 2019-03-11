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

export const makePlane = (normal: Vector, offset: number, surface: Surface): Plane => ({
    type: BodyType.Plane,
    surface,
    normal: norm(normal),
    offset,
});

export const planeHandler: BodyHandler<Plane> = {
    intersect(ray: Ray, plane: Plane): number {
        const denom = dot(plane.normal, ray.dir);
        return denom > 0 ? null : (dot(plane.normal, ray.start) + plane.offset) / -denom;
    },

    normal: (_pos: Vector, plane: Plane): Vector => plane.normal,
};
