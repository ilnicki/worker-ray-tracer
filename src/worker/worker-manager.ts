import { WorkerController } from './worker-controller';

export class WorkerManager {
    private pool: WorkerController[];

    constructor(count: number) {
        for (let i = 0; i < count; i++) {
            this.pool[i] = new WorkerController();
        }
    }
}
