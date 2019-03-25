import { Vector } from 'math/vector';
import { black, white } from '../../math/color';
import { always } from '../../util/functional';
import { SurfaceHandler } from './handler';
import { Surface, SurfaceType } from './surface';

export interface Checkerboard extends Surface {
    type: SurfaceType.Checkerboard;
    size: number;
}

export const checkerboard = (size = 1): Checkerboard => ({
    type: SurfaceType.Checkerboard,
    size,
});

const isBright = (pos: Vector, size: number) => (Math.floor(pos.z * size) + Math.floor(pos.x * size)) % 2 * size !== 0;

export const checkerboardHandler: SurfaceHandler<Checkerboard> = {
    diffuse: (surface, pos) => isBright(pos, 1 / surface.size) ? white : black,
    specular: always(white),
    reflect: (surface, pos) => isBright(pos, 1 / surface.size) ? 0.15 : 0.5,
    roughness: always(150),
};
