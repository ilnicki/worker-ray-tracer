import { Body } from './body';
import { Ray } from './ray';

export interface Intersection {
    body: Body;
    ray: Ray;
    dist: number;
}
