import { Scene } from 'tracer/scene';
import { Point } from '../tracer/point';
import { RayTracer } from '../tracer/ray-tracer';
import { Rect, RectTrace } from './worker-controller';

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
                context.postMessage(undefined);
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
                let pointer = 0;

                for (let y = position.y; y < position.y + image.height; y++) {
                    for (let x = position.x; x < position.x + image.width; x++) {
                        const color = this.tracer.tracePoint(x, y);

                        image.data[pointer++] = color.r;
                        image.data[pointer++] = color.g;
                        image.data[pointer++] = color.b;
                        image.data[pointer++] = 255;
                    }
                }

                context.postMessage<RectTrace>({
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
}
