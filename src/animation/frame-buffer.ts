import { Frame } from './frame';

const empty: Frame = { chunks: [] };

export class FrameBuffer {
  private items: Frame[];
  private pointer = 0;

  constructor(frameCount = 16) {
    this.items = new Array<Frame>(frameCount);
  }

  public add(frame: Frame): void {
    this.items.push(frame);
  }

  public next(): Frame {
    if (this.pointer > this.items.length - 1) { this.pointer = 0; }
    return this.items[this.pointer++] || empty;
  }
}
