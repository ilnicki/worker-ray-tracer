import { Intersection } from '../intersection';
import { Ray } from '../ray';
import { Surface } from '../surfaces/surface';
import { dot } from '../vector';
import { Vector } from '../vector';
import { Body, BodyType } from './body';
import { BodyHandler } from './handlers';

export interface Plane extends Body {
    type: BodyType.Plane;
    surface: Surface;
    norm: Vector;
    offset: number;
}

export const makePlane = (norm: Vector, offset: number, surface: Surface): Plane => ({
    type: BodyType.Plane,
    surface,
    norm,
    offset,
});

export const planeHandler: BodyHandler<Plane> = {
    intersect(ray: Ray, plane: Plane): Intersection<Plane> {
        const denom = dot(plane.norm, ray.dir);

        if (denom > 0) {
            return null;
        } else {
            const dist = (dot(plane.norm, ray.start) + plane.offset) / (-denom);
            return { body: plane, ray, dist };
        }
    },

    normal: (_pos: Vector, plane: Plane) => plane.norm,
};
