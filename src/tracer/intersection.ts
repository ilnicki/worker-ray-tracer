import { Body } from './bodies/body';
import { Ray } from './ray';

export interface Intersection<T extends Body = Body> {
    body: T;
    ray: Ray;
    dist: number;
}
