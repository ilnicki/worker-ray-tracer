import { Body, BodyHandler } from './body';
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
    intersect: (ray: Ray, plane: Plane): number => {
        const denom = dot(plane.normal, ray.dir);
        return denom > 0 ? null : (dot(plane.normal, ray.start) + plane.offset) / (-denom);
    },

    normal: (_pos: Vector, plane: Plane) => plane.normal,
};
