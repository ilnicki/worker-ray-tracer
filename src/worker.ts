import { WorkerExecutor } from './worker/worker-executor';

const executor = new WorkerExecutor();

executor.attachTo({
    postMessage: postMessage.bind(this),
    addEventListener: addEventListener.bind(this),
});
