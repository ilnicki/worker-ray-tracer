import { Frame } from './frame';

const empty: Frame = { chunks: [] };

export class FrameQueue {
    private items: Array<Frame>;

    constructor(frameCount = 16) {
        this.items = new Array<Frame>(frameCount);
    }

    public enqueue(frame: Frame): void {
        this.items.push(frame);
    }

    public dequeue(): Frame {
        return this.items.shift() || empty;
    }
}
