import { Frame } from '../render/frame';
import { Camera } from '../tracer/camera';
import { Scene } from '../tracer/scene';
import { WorkerController } from './worker-controller';

export class WorkerManager {
    private pool: WorkerController[];
    private camera: Camera;

    constructor(count: number) {
        this.pool = Array(count).fill(null).map(() => new WorkerController());
    }

    public async setScene(scene: Scene): Promise<void> {
        this.camera = scene.camera;
        await Promise.all(this.pool.map(wc => wc.setScene(scene)));
    }

    public trace(): Promise<Frame> {
        return Promise.all(this.pool.map((wc, workerId, { length }) =>
            wc.traceRect({
                x: 0,
                y: Math.floor(this.camera.height / length * workerId),
                w: this.camera.width,
                h: Math.ceil(this.camera.height / length),
            })
        )).then(chunks => ({
            chunks,
        }));
    }
}
