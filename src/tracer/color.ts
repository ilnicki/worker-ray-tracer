export interface Color {
    r: number;
    g: number;
    b: number;
}

export const white: Color = { r: 1.0, g: 1.0, b: 1.0 };
export const grey: Color = { r: 0.5, g: 0.5, b: 0.5 };
export const black: Color = { r: 0.0, g: 0.0, b: 0.0 };
export const background: Color = black;
export const defaultColor: Color = black;

export const scale = (k: number, v: Color): Color =>
    ({ r: k * v.r, g: k * v.g, b: k * v.b });

export const plus = (v1: Color, v2: Color): Color =>
    ({ r: v1.r + v2.r, g: v1.g + v2.g, b: v1.b + v2.b });

export const times = (v1: Color, v2: Color): Color =>
    ({ r: v1.r * v2.r, g: v1.g * v2.g, b: v1.b * v2.b });

export const toDrawingColor = (c: Color): Color => {
    return {
        r: Math.floor(Math.min(1, c.r) * 255),
        g: Math.floor(Math.min(1, c.g) * 255),
        b: Math.floor(Math.min(1, c.b) * 255),
    };
};

export const toString = (c: Color): string => `rgb(${c.r}, ${c.g}, ${c.b}`;
