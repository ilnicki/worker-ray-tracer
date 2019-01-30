import { always } from '../util/functional';
import { black, Color, grey, white } from './color';
import { Vector } from './vector';

export interface Surface {
    diffuse: (pos: Vector) => Color;
    specular: (pos: Vector) => Color;
    reflect: (pos: Vector) => number;
    roughness: number;
}

export const shiny: Surface = {
    diffuse: always(white),
    specular: always(grey),
    reflect: always(0.7),
    roughness: 250,
};

export const matt: Surface = {
    diffuse: always(white),
    specular: always(black),
    reflect: always(0.01),
    roughness: 900,
};

export const checkerboard: Surface = {
    diffuse: pos => ((Math.floor(pos.z) + Math.floor(pos.x)) % 2 !== 0) ? white : black,
    specular: always(white),
    reflect: pos => ((Math.floor(pos.z) + Math.floor(pos.x)) % 2 !== 0) ? 0.1 : 0.7,
    roughness: 150,
};
