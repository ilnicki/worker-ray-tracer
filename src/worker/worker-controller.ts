import { Camera } from 'tracer/camera';
import { Point } from '../tracer/point';
import { Scene } from '../tracer/scene';

export interface RectTrace {
    position: Point;
    image: ImageData;
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

    public setScene(scene: Scene): Promise<void> {
        return new Promise((resolve, reject) => {
            this.worker.postMessage({ scene });
            this.worker.addEventListener('message', () => resolve(), { once: true });
        });
    }

    public setCamera(camera: Camera): Promise<void> {
        return new Promise((resolve, reject) => {
            this.worker.postMessage({ camera });
            this.worker.addEventListener('message', () => resolve(), { once: true });
        });
    }

    public traceRect(rect: Rect): Promise<RectTrace> {
        return new Promise((resolve, reject) => {
            this.worker.postMessage({ rect });
            this.worker.addEventListener('message', ({ data }) => resolve(data), { once: true });
        });
    }
}
