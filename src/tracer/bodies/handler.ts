import { Vector } from '../../math/vector';
import { Ray } from '../ray';
import { Body } from './body';

export interface BodyHandler<T extends Body = Body> {
    intersect: (ray: Ray, body: T) => number;
    normal: (pos: Vector, body: T) => Vector;
}
