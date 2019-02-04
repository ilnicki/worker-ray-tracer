import { Body, BodyHandler } from './body';
import { Intersection } from './intersection';
import { Ray } from './ray';
import { SurfaceId } from './surface';
import { dot } from './vector';
import { Vector } from './vector';

export interface Plane extends Body {
    handlerId: 'plane';
    surfaceId: SurfaceId;
    norm: Vector;
    offset: number;
}

export const makePlane = (norm: Vector, offset: number, surfaceId: SurfaceId): Plane => ({
    handlerId: 'plane',
    surfaceId,
    norm,
    offset,
});

export const PlaneHandler: BodyHandler<Plane> = {
    intersect(ray: Ray, plane: Plane): Intersection {
        const denom = dot(plane.norm, ray.dir);

        if (denom > 0) {
            return null;
        } else {
            const dist = (dot(plane.norm, ray.start) + plane.offset) / (-denom);
            return { body: plane, ray, dist };
        }
    },

    normal: (pos: Vector, plane: Plane) => plane.norm,
};
