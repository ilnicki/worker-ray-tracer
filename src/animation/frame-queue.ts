import { Frame } from './frame';

export class FrameQueue {
    private items = new Array<Frame>(16);

    public enqueue(frame: Frame): void {
        this.items.push(frame);
    }

    public dequeue(): Frame {
        return this.items.shift() || [];
    }
}
