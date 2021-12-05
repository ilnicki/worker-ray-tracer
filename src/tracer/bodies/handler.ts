import { Vector } from '../../math/vector';
import { Ray } from '../ray';
import { Body } from './body';

export interface BodyHandler<T extends Body = Body> {
    intersect: (ray: Ray, body: T) => number | null; // distance to intersection
    normal: (pos: Vector, body: T) => Vector;
}
