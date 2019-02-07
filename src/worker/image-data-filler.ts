import { Color } from "tracer/color";

export class ImageDataFiller {
    private pointer = 0;
    private data: Uint8ClampedArray;

    constructor(
        imageData: ImageData,
    ) {
        this.data = imageData.data;
    }

    public append(color: Color): void {
        this.data[this.pointer++] = color.r;
        this.data[this.pointer++] = color.g;
        this.data[this.pointer++] = color.b;
        this.data[this.pointer++] = 255;
    }
}
