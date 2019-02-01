export interface Vector {
    x: number;
    y: number;
    z: number;
}

export const times = (k: number, v: Vector): Vector => ({
    x: k * v.x,
    y: k * v.y,
    z: k * v.z,
});

export const minus = (v1: Vector, v2: Vector): Vector => ({
    x: v1.x - v2.x,
    y: v1.y - v2.y,
    z: v1.z - v2.z,
});

export const plus = (v1: Vector, v2: Vector): Vector => ({
    x: v1.x + v2.x,
    y: v1.y + v2.y,
    z: v1.z + v2.z,
});

export const dot = (v1: Vector, v2: Vector): number =>
    v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;

export const mag = (v: Vector): number =>
    Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

export const norm = (v: Vector): Vector => {
    const vmag = mag(v);
    return times((vmag === 0) ? Infinity : 1.0 / vmag, v);
};

export const cross = (v1: Vector, v2: Vector): Vector => ({
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x,
});
