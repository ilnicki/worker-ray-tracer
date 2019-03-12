export interface Color {
    readonly r: number;
    readonly g: number;
    readonly b: number;
}

export const color = (r: number, g: number, b: number): Color => ({
    r,
    g,
    b,
});

export const white: Color = color(1.0, 1.0, 1.0);
export const grey: Color = color(0.5, 0.5, 0.5);
export const black: Color = color(0.0, 0.0, 0.0);
export const background: Color = black;
export const defaultColor: Color = black;

export const scale = (col: Color, factor: number): Color => color(
    col.r * factor,
    col.g * factor,
    col.b * factor,
);

export const sum = (c1: Color, c2: Color): Color => color(
    c1.r + c2.r,
    c1.g + c2.g,
    c1.b + c2.b,
);

export const mul = (c1: Color, c2: Color): Color => color(
    c1.r * c2.r,
    c1.g * c2.g,
    c1.b * c2.b,
);

export const toDrawingColor = (c: Color): Color => color(
    Math.floor(Math.min(1, c.r) * 255),
    Math.floor(Math.min(1, c.g) * 255),
    Math.floor(Math.min(1, c.b) * 255),
);

export const toString = (c: Color): string => `rgb(${c.r}, ${c.g}, ${c.b}`;

export const fromNumber = (num: number): Color => color(
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
);

export const fromHex = (hex: string): Color => fromNumber(parseInt(hex, 16));
