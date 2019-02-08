export interface Color {
    readonly r: number;
    readonly g: number;
    readonly b: number;
}

export const white: Color = { r: 1.0, g: 1.0, b: 1.0 };
export const grey: Color = { r: 0.5, g: 0.5, b: 0.5 };
export const black: Color = { r: 0.0, g: 0.0, b: 0.0 };
export const background: Color = black;
export const defaultColor: Color = black;

export const scale = (k: number, c: Color): Color => ({
    r: k * c.r,
    g: k * c.g,
    b: k * c.b,
});

export const plus = (c1: Color, c2: Color): Color => ({
    r: c1.r + c2.r,
    g: c1.g + c2.g,
    b: c1.b + c2.b,
});

export const times = (c1: Color, c2: Color): Color => ({
    r: c1.r * c2.r,
    g: c1.g * c2.g,
    b: c1.b * c2.b,
});

export const toDrawingColor = (c: Color): Color => {
    return {
        r: Math.floor(Math.min(1, c.r) * 255),
        g: Math.floor(Math.min(1, c.g) * 255),
        b: Math.floor(Math.min(1, c.b) * 255),
    };
};

export const toString = (c: Color): string => `rgb(${c.r}, ${c.g}, ${c.b}`;

export const fromNumber = (num: number): Color => ({
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
});

export const fromHex = (hex: string): Color => fromNumber(parseInt(hex, 16));
