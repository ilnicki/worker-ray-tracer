import { Color } from '../../math/color';
import { Vector } from '../../math/vector';
import { checkerboardHandler } from './checkerboard';
import { mattHandler } from './matt';
import { shinyHandler } from './shiny';
import { Surface, SurfaceType } from './surface';

export interface SurfaceHandler<T extends Surface = Surface> {
    diffuse: (surface: T, pos: Vector) => Color;
    specular: (surface: T, pos: Vector) => Color;
    reflect: (surface: T, pos: Vector) => number;
    roughness: (surface: T, pos: Vector) => number;
}

const surfaceHandlers = new Map<SurfaceType, SurfaceHandler>([
    [SurfaceType.Shiny, shinyHandler],
    [SurfaceType.Matt, mattHandler],
    [SurfaceType.Checkerboard, checkerboardHandler],
]);

export const getSurfaceHandler = <T extends Surface = Surface>(surface: T): SurfaceHandler<T> =>
    surfaceHandlers.get(surface.type) as SurfaceHandler<T>;
