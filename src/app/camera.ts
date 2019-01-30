import { cross, minus, norm, times, Vector } from './vector';

export interface Camera {
    pos: Vector;
    forward: Vector;
    right: Vector;
    up: Vector;
    width: number;
    height: number;
}

export const makeCamera = (pos: Vector, lookAt: Vector, width: number, height: number): Camera  => {
    const forward = norm(minus(lookAt, pos));
    const right = times(1.5, norm(cross(forward, { x: 0.0, y: -1.0, z: 0.0 })));
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

export const iterate = function*(camera: Camera) {
    for (let y = 0; y < camera.height; y++) {
        for (let x = 0; x < camera.width; x++) {
            yield [x, y];
        }
    }
};
