import { Body, BodyType } from './body';
import { BodyHandler } from './handler';
import { planeHandler } from './plane';
import { sphereHandler } from './sphere';

const handlerMap = new Map<BodyType, BodyHandler>([
    [BodyType.Sphere, sphereHandler],
    [BodyType.Plane, planeHandler],
]);

export const getBodyHandler = <T extends Body = Body>(body: T): BodyHandler<T> =>
    handlerMap.get(body.type) as BodyHandler<T>;
