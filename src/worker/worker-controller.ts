import { Color } from '../tracer/color';
import { Point } from '../tracer/point';
import { Scene } from '../tracer/scene';

export type PointTrace = [number, number, string];

export interface RectTrace {
    rect: Rect;
    result: Int8Array;
}

export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

export class WorkerController {
    private worker: Worker;

    constructor() {
        this.worker = new Worker('worker.bundle.js');
    }

    public setScene(scene: Scene) {
        this.worker.postMessage({ scene });
    }

    public tracePoint(point: Point): Promise<PointTrace> {
        return new Promise((resolve, reject) => {
            this.worker.postMessage({ point });
            this.worker.addEventListener('message', ({ data }) => resolve(data), { once: true });
        });
    }

    public traceRect(rect: Rect): Promise<RectTrace> {
        return new Promise((resolve, reject) => {
            this.worker.postMessage({ rect });
            this.worker.addEventListener('message', ({ data }) => resolve(data), { once: true });
        });
    }
}
