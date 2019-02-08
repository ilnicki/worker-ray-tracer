export interface Vector {
    readonly x: number;
    readonly y: number;
    readonly z: number;
}

export const make = (x: number, y: number, z: number): Vector => {
    return {
        x,
        y,
        z,
    };
};

export const times = (k: number, v: Vector): Vector => make(
    k * v.x,
    k * v.y,
    k * v.z,
);

export const minus = (v1: Vector, v2: Vector): Vector => make(
    v1.x - v2.x,
    v1.y - v2.y,
    v1.z - v2.z,
);

export const plus = (v1: Vector, v2: Vector): Vector => make(
    v1.x + v2.x,
    v1.y + v2.y,
    v1.z + v2.z,
);

export const dot = (v1: Vector, v2: Vector): number =>
    v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;

export const mag = (v: Vector): number =>
    Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);

export const norm = (v: Vector): Vector => {
    const vmag = mag(v);
    return times((vmag === 0) ? Infinity : 1.0 / vmag, v);
};

export const cross = (v1: Vector, v2: Vector): Vector => make(
    v1.y * v2.z - v1.z * v2.y,
    v1.z * v2.x - v1.x * v2.z,
    v1.x * v2.y - v1.y * v2.x,
);
