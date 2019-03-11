import { Intersection } from '../intersection';
import { Ray } from '../ray';
import { Vector } from '../vector';
import { Body, BodyType } from './body';
import { planeHandler } from './plane';
import { sphereHandler } from './sphere';

export interface BodyHandler<T extends Body = Body> {
    intersect: (ray: Ray, body: T) => Intersection<T>;
    normal: (pos: Vector, body: T) => Vector;
}

const bodyHandlers = new Map<BodyType, BodyHandler>([
    [BodyType.Sphere, sphereHandler],
    [BodyType.Plane, planeHandler],
]);

export const getBodyHandler = <T extends Body = Body>(body: T): BodyHandler<T> =>
    bodyHandlers.get(body.type) as BodyHandler<T>;
