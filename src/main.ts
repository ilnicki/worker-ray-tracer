import { fromHex } from './math/color';
import { vector } from './math/vector';
import { Frame } from './render/frame';
import { plane } from './tracer/bodies/plane';
import { sphere } from './tracer/bodies/sphere';
import { camera } from './tracer/camera';
import { light } from './tracer/light-source';
import { Scene } from './tracer/scene';
import { checkerboard } from './tracer/surfaces/checkerboard';
import { matt } from './tracer/surfaces/matt';
import { shiny } from './tracer/surfaces/shiny';
import { WorkerManager } from './worker/worker-manager';

const WIDTH = 512;
const HEIGHT = 512;

const defaultScene = {
    bodies: [
        plane(vector(0.0, 1.0, 0.0), 0.0, checkerboard()),
        sphere(vector(0.0, 1.0, -0.25), 1.0, shiny()),
        sphere(vector(-1.0, 0.5, 1.5), 0.5, shiny()),
        sphere(vector(-4, 0.7, -1.5), 0.7, matt()),
    ],
    lights: [
        light(vector(-2.0, 2.5, 0.0), fromHex('7d1212')),
        light(vector(1.5, 2.5, 1.5), fromHex('12127d')),
        light(vector(1.5, 2.5, -1.5), fromHex('127d12')),
        light(vector(0.0, 3.5, 0.0), fromHex('363659')),
    ],
    camera: camera(vector(4.0, 3.0, 5.0), vector(-1.0, 0.5, 0.0), WIDTH, HEIGHT),
} as Scene;

document.body.onload = async () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    if (canvas.getContext) {
        const ctx = canvas.getContext('2d')!;
        const manager = new WorkerManager(4);

        const drawScene = (frame: Frame) => window.requestAnimationFrame(() => {
            frame.chunks.forEach(({ position: { x, y }, image }) => {
                ctx.putImageData(image, x, y);
            });

            drawScene(frame);
        });

        await manager.setScene(defaultScene);
        await manager.trace().then(drawScene);

    } else {
        throw new Error('Application can not be drawn.');
    }
};
