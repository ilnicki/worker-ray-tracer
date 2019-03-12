import { Chunk } from '../animation/chunk';
import { Camera } from '../tracer/camera';
import { Scene } from '../tracer/scene';

export interface Rect {
    readonly x: number;
    readonly y: number;
    readonly w: number;
    readonly h: number;
}

export class WorkerController {
    private worker: Worker;

    constructor() {
        this.worker = new Worker('worker.bundle.js');
    }

    public setScene(scene: Scene): Promise<void> {
        return new Promise(resolve => {
            this.worker.postMessage({ scene });
            this.worker.addEventListener('message', () => resolve(null), { once: true });
        });
    }

    public setCamera(camera: Camera): Promise<void> {
        return new Promise(resolve => {
            this.worker.postMessage({ camera });
            this.worker.addEventListener('message', () => resolve(null), { once: true });
        });
    }

    public traceRect(rect: Rect): Promise<Chunk> {
        return new Promise(resolve => {
            this.worker.postMessage({ rect });
            this.worker.addEventListener('message', ({ data }) => resolve(data), { once: true });
        });
    }
}
