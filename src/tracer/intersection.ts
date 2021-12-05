import { Body } from './bodies/body';
import { getBodyHandler } from './bodies/handler-map';
import { Ray } from './ray';

export interface Intersection<T extends Body = Body> {
    body: T;
    ray: Ray;
    dist: number;
}

export const detectIntersection = (ray: Ray, bodies: Body[]): Intersection | null => {
    let body = null;
    let dist = Infinity;

    for (const bodyEntry of bodies) {
        const interDist = getBodyHandler(bodyEntry).intersect(ray, bodyEntry);
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
