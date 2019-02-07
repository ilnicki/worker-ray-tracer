import { Chunk } from '../animation/chunk';
import { Camera } from '../tracer/camera';
import { Point } from '../tracer/point';
import { RayTracer } from '../tracer/ray-tracer';
import { Scene } from '../tracer/scene';
import { ImageDataFiller } from './image-data-filler';
import { Rect } from './worker-controller';

export interface WorkerContext {
    postMessage<T = any>(message: T, transfer?: Transferable[]): void;
    addEventListener<K extends keyof WorkerEventMap>(
        type: K,
        listener: (this: Worker, event: WorkerEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
}

export class WorkerExecutor {
    private tracer = new RayTracer();

    public attachTo(context: WorkerContext) {
        context.addEventListener('message', ({ data }) => {
            if (this.isSceneSetting(data)) {
                this.tracer.scene = data.scene;
                context.postMessage(null);
            } else if (this.isCameraSetting(data)) {
                this.tracer.scene.camera = data.camera;
                context.postMessage(null);
            } else if (this.isRectTrace(data)) {
                const position: Point = {
                    x: data.rect.x,
                    y: data.rect.y,
                };
                const image = new ImageData(
                    new Uint8ClampedArray(4 * data.rect.w * data.rect.h),
                    data.rect.w,
                    data.rect.h,
                );
                const filler = new ImageDataFiller(image);

                for (let y = position.y; y < position.y + image.height; y++) {
                    for (let x = position.x; x < position.x + image.width; x++) {
                        filler.append(this.tracer.tracePoint(x, y));
                    }
                }

                context.postMessage<Chunk>({
                    position,
                    image,
                }, [image.data.buffer]);
            }
        });
    }

    private isRectTrace(data: unknown): data is { rect: Rect } {
        return typeof data === 'object' && data.hasOwnProperty('rect');
    }

    private isSceneSetting(data: unknown): data is { scene: Scene } {
        return typeof data === 'object' && data.hasOwnProperty('scene');
    }

    private isCameraSetting(data: unknown): data is { camera: Camera } {
        return typeof data === 'object' && data.hasOwnProperty('camera');
    }
}
