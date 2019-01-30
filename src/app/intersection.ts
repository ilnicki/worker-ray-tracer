import { Ray } from './ray';
import { Thing } from './thing';

export interface Intersection {
    thing: Thing;
    ray: Ray;
    dist: number;
}
