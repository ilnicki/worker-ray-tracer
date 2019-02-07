import { Intersection } from './intersection';
import { planeHandler } from './plane';
import { Ray } from './ray';
import { sphereHandler } from './sphere';
import { SurfaceId } from './surface';
import { Vector } from './vector';

export interface Body {
    surfaceId: SurfaceId;
    handlerId: BodyHandlerId;
}

export interface BodyHandler<T extends Body = Body> {
    intersect: (ray: Ray, body: T) => Intersection;
    normal: (pos: Vector, body: T) => Vector;
}

export interface BodyHandlerRegistry {
    plane: BodyHandler;
    sphere: BodyHandler;
}

export type BodyHandlerId = keyof BodyHandlerRegistry;

export const registry: BodyHandlerRegistry = {
    plane: planeHandler,
    sphere: sphereHandler,
};
