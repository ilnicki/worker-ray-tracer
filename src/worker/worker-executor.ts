import { Chunk } from '../render/chunk';
import { RayTracer } from '../tracer/ray-tracer';
import { Scene } from '../tracer/scene';
import { ImageDataFiller } from './image-data-filler';
import { Job, JobResult, JobType } from './job';
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
    private context: WorkerContext;

    public attachTo(context: WorkerContext) {
        this.context = context;
        this.context.addEventListener('message', ({ data }) => this.handleJob(data));
    }

    private handleJob(job: Job) {
        if (this.isSceneSetting(job)) {
            this.tracer.scene = job.payload.scene;
            this.postResult(job, null);
        } else if (this.isRectTrace(job)) {
            this.traceRect(job);
        }
    }

    private isRectTrace(job: Job): job is Job<{ rect: Rect }> {
        return job.type === JobType.TraceRect && 'rect' in job.payload;
    }

    private traceRect(job: Job<{ rect: Rect }>) {
        const rect = job.payload.rect;
        const image = new ImageData(
            new Uint8ClampedArray(4 * rect.w * rect.h),
            rect.w,
            rect.h,
        );
        const filler = new ImageDataFiller(image);

        for (let y = rect.y; y < rect.y + image.height; y++) {
            for (let x = rect.x; x < rect.x + image.width; x++) {
                filler.append(this.tracer.tracePoint(x, y));
            }
        }

        this.postResult<Chunk>(job, {
            image,
            position: {
                x: rect.x,
                y: rect.y,
            },
        }, [image.data.buffer]);
    }

    private isSceneSetting(job: Job): job is Job<{ scene: Scene }> {
        return job.type === JobType.SetScene && 'scene' in job.payload;
    }

    private postResult<T = any>(job: Job, payload: T, transfer?: Transferable[]): void {
        this.context.postMessage<JobResult<T>>(this.makeResult(job, payload), transfer);
    }

    private makeResult<T = any>(job: Job, payload: T): JobResult<T> {
        return {
            id: job.id,
            payload,
        };
    }
}
