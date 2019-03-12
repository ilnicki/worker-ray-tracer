import { grey, white } from '../../math/color';
import { always } from '../../util/functional';
import { SurfaceHandler } from './handlers';
import { Surface, SurfaceType } from './surface';

export interface Shiny extends Surface {
    type: SurfaceType.Shiny;
}

export const shiny = (): Shiny => ({
    type: SurfaceType.Shiny,
});

export const shinyHandler: SurfaceHandler<Shiny> = {
    diffuse: always(white),
    specular: always(grey),
    reflect: always(0.7),
    roughness: always(250),
};
