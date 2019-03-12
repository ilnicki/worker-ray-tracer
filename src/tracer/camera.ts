import { cross, minus, norm, times, Vector, vector } from './vector';

export interface Camera {
    pos: Vector;
    forward: Vector;
    right: Vector;
    up: Vector;
    width: number;
    height: number;
}

const down: Vector = vector(0.0, -1.0, 0.0);

export const camera = (pos: Vector, lookAt: Vector, width: number, height: number): Camera => {
    const forward = norm(minus(lookAt, pos));
    const right = times(1.5, norm(cross(forward, down)));
    const up = times(1.5, norm(cross(forward, right)));

    return {
        pos,
        forward,
        right,
        up,
        width,
        height,
    };
};
