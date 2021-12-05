import { FrameBuffer } from './animation/frame-buffer';
import { fromHex } from './math/color';
import { vector } from './math/vector';
import { plane } from './tracer/bodies/plane';
import { sphere } from './tracer/bodies/sphere';
import { Camera, camera } from './tracer/camera';
import { Scene } from './tracer/scene';
import { checkerboard } from './tracer/surfaces/checkerboard';
import { matt } from './tracer/surfaces/matt';
import { shiny } from './tracer/surfaces/shiny';
import { WorkerManager } from './worker/worker-manager';

const WIDTH = 930;
const HEIGHT = 930;

const defaultScene = (): Scene => ({
    bodies: [
        plane(vector(0.0, 1.0, 0.0), 0.0, checkerboard()),
        sphere(vector(0.0, 1.0, -0.25), 1.0, shiny()),
        sphere(vector(-1.0, 0.5, 1.5), 0.5, shiny()),
        sphere(vector(-4, 0.7, -1.5), 0.7, matt()),
    ],
    lights: [
        { pos: vector(-2.0, 2.5, 0.0), color: fromHex('7d1212') },
        { pos: vector(1.5, 2.5, 1.5), color: fromHex('12127d') },
        { pos: vector(1.5, 2.5, -1.5), color: fromHex('127d12') },
        { pos: vector(0.0, 3.5, 0.0), color: fromHex('363659') },
    ],
    camera: defaultCamera(WIDTH, HEIGHT, 0),
});

const position = vector(4.0, 3.0, 5.0);
const target = vector(-1.0, 0.5, 0.0);

const defaultCamera = (width: number, height: number, angle: number): Camera =>
    camera(vector(
        Math.cos(angle) * (position.x - target.x) - Math.sin(angle) * (position.z - target.z) + target.x,
        position.y,
        Math.sin(angle) * (position.x - target.x) + Math.cos(angle) * (position.z - target.z) + target.z,
    ), target, width, height);

document.body.onload = async () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.width = 930;
    canvas.height = 930;

    if (canvas.getContext) {
        const ctx = canvas.getContext('2d')!;
        const manager = new WorkerManager(4);

        const frames = new FrameBuffer();
        const trydraw = () => window.requestAnimationFrame(() => {
            frames.next().chunks.forEach(({ position: { x, y }, image }) => {
                ctx.putImageData(image, x, y);
            });
            trydraw();
        });

        await manager.setScene(defaultScene());

        manager.trace(0).then(frame => frames.add(frame));

        setTimeout(trydraw);
    } else {
        throw new Error('Application can not be drawn.');
    }
};
