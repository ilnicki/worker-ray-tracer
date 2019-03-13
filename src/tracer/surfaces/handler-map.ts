import { checkerboardHandler } from './checkerboard';
import { SurfaceHandler } from './handler';
import { mattHandler } from './matt';
import { shinyHandler } from './shiny';
import { Surface, SurfaceType } from './surface';

const surfaceHandlers = new Map<SurfaceType, SurfaceHandler>([
    [SurfaceType.Shiny, shinyHandler],
    [SurfaceType.Matt, mattHandler],
    [SurfaceType.Checkerboard, checkerboardHandler],
]);

export const getSurfaceHandler = <T extends Surface = Surface>(surface: T): SurfaceHandler<T> =>
    surfaceHandlers.get(surface.type) as SurfaceHandler<T>;
