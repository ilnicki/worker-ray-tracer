import * as c from '../tracer/color';
import { RayTracer } from '../tracer/ray-tracer';
import { PointTrace, Rect } from './worker-controller';

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
            if (data.scene) {
                this.tracer.scene = data.scene;
            } else if (data.point) {
                context.postMessage<PointTrace>([
                    data.point[0],
                    data.point[1],
                    c.toString(this.tracer.tracePoint(data.point[0], data.point[1])),
                ]);
            } else if (data.rect) {
                const rect: Rect = data.rect;
                const result = new Uint8Array(rect.w * rect.h * 3);
                let pointer = 0;

                for (let y = rect.y; y < rect.h; y++) {
                    for (let x = rect.x; x < rect.w; x++) {
                        const color = this.tracer.tracePoint(x, y);

                        result[pointer++] = color.r;
                        result[pointer++] = color.g;
                        result[pointer++] = color.b;
                    }
                }
                context.postMessage({rect, result}, [result.buffer]);
            }
        });
    }
}
