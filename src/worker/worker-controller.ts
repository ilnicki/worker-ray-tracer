import { Chunk } from '../animation/chunk';
import { Camera } from '../tracer/camera';
import { Scene } from '../tracer/scene';
import { JobResult, JobType } from './job';

export interface Rect {
    readonly x: number;
    readonly y: number;
    readonly w: number;
    readonly h: number;
}

export class WorkerController {
    private worker: Worker;
    private nextJobId = 0;
    private jobs = new Map<number, (result: any) => void>();

    constructor() {
        this.worker = new Worker('worker.bundle.js');
        this.worker.addEventListener('message', ({ data }) => this.handleJobResult(data));
    }

    public setScene(scene: Scene): Promise<void> {
        return this.postJob(JobType.SetScene, { scene });
    }

    public setCamera(camera: Camera): Promise<void> {
        return this.postJob(JobType.SetCamera, { camera });
    }

    public traceRect(rect: Rect): Promise<Chunk> {
        return this.postJob(JobType.TraceRect, { rect });
    }

    private postJob<T = any>(type: JobType, payload: T): Promise<any> {
        return new Promise(resolve => {
            const id = this.nextJobId++;

            this.worker.postMessage({
                id,
                type,
                payload,
            });

            this.jobs.set(id, resolve);
        });
    }

    private handleJobResult(result: JobResult) {
        this.jobs.get(result.id)!(result.payload);
        this.jobs.delete(result.id);
    }
}
