import { black, white } from '../../math/color';
import { always } from '../../util/functional';
import { SurfaceHandler } from './handlers';
import { Surface, SurfaceType } from './surface';

export interface Checkerboard extends Surface {
    type: SurfaceType.Checkerboard;
}

export const checkerboard = (): Checkerboard => ({
    type: SurfaceType.Checkerboard,
});

export const checkerboardHandler: SurfaceHandler<Checkerboard> = {
    diffuse: (_surface, pos) => ((Math.floor(pos.z) + Math.floor(pos.x)) % 2 !== 0) ? white : black,
    specular: always(white),
    reflect: (_surface, pos) => ((Math.floor(pos.z) + Math.floor(pos.x)) % 2 !== 0) ? 0.15 : 0.5,
    roughness: always(150),
};
