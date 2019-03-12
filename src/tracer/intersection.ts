import { Body } from './bodies/body';
import { getBodyHandler } from './bodies/handlers';
import { Ray } from './ray';

export interface Intersection<T extends Body = Body> {
    body: T;
    ray: Ray;
    dist: number;
}

export const detectIntersection = (ray: Ray, bodies: Body[]): Intersection => {
    let body = null;
    let dist = Infinity;

    for (const bodyEntry of bodies) {
        const interDist = getBodyHandler(bodyEntry).intersect(ray, body);
        if (interDist !== null && interDist < dist) {
            dist = interDist;
            body = bodyEntry;
        }
    }

    return body && {
        body,
        ray,
        dist,
    };
};
