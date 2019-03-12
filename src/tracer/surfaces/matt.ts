import { black, white } from '../../math/color';
import { always } from '../../util/functional';
import { SurfaceHandler } from './handlers';
import { Surface, SurfaceType } from './surface';

export interface Matt extends Surface {
    type: SurfaceType.Matt;
}

export const matt = (): Matt => ({
    type: SurfaceType.Matt,
});

export const mattHandler: SurfaceHandler<Matt> = {
    diffuse: always(white),
    specular: always(black),
    reflect: always(0.01),
    roughness: always(900),
};
