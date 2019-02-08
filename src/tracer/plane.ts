import { Body, BodyHandler } from './body';
import { Intersection } from './intersection';
import { Ray } from './ray';
import { SurfaceId } from './surface';
import { dot, norm } from './vector';
import { Vector } from './vector';

export interface Plane extends Body {
    handlerId: 'plane';
    surfaceId: SurfaceId;
    normal: Vector;
    offset: number;
}

export const makePlane = (normal: Vector, offset: number, surfaceId: SurfaceId): Plane => ({
    handlerId: 'plane',
    surfaceId,
    normal: norm(normal),
    offset,
});

export const planeHandler: BodyHandler<Plane> = {
    intersect(ray: Ray, plane: Plane): Intersection {
        const denom = dot(plane.normal, ray.dir);

        if (denom > 0) {
            return null;
        } else {
            const dist = (dot(plane.normal, ray.start) + plane.offset) / (-denom);
            return { body: plane, ray, dist };
        }
    },

    normal: (_pos: Vector, plane: Plane) => plane.normal,
};
