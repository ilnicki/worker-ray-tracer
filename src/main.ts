import { FrameQueue } from './animation/frame-queue';
import { makePlane } from './tracer/bodies/plane';
import { makeSphere } from './tracer/bodies/sphere';
import { Camera, makeCamera } from './tracer/camera';
import { fromHex } from './tracer/color';
import { Scene } from './tracer/scene';
import { makeCheckerboard } from './tracer/surfaces/checkerboard';
import { makeMatt } from './tracer/surfaces/matt';
import { makeShiny } from './tracer/surfaces/shiny';
import { vector } from './tracer/vector';
import { WorkerManager } from './worker/worker-manager';

const makeDefaultScene = (): Scene => ({
    bodies: [
        makePlane(vector(0.0, 1.0, 0.0), 0.0, makeCheckerboard()),
        makeSphere(vector(0.0, 1.0, -0.25), 1.0, makeShiny()),
        makeSphere(vector(-1.0, 0.5, 1.5), 0.5, makeShiny()),
        makeSphere(vector(-4, 0.7, -1.5), 0.7, makeMatt()),
    ],
    lights: [
        { pos: vector(-2.0, 2.5, 0.0), color: fromHex('7d1212') },
        { pos: vector(1.5, 2.5, 1.5), color: fromHex('12127d') },
        { pos: vector(1.5, 2.5, -1.5), color: fromHex('127d12') },
        { pos: vector(0.0, 3.5, 0.0), color: fromHex('363659') },
    ],
});

const pos = vector(4.0, 3.0, 5.0);
const tg = vector(-1.0, 0.5, 0.0);

const makeDefaultCamera = (width: number, height: number, angle: number): Camera =>
    makeCamera(vector(
        Math.cos(angle) * (pos.x - tg.x) - Math.sin(angle) * (pos.z - tg.z) + tg.x,
        pos.y,
        Math.sin(angle) * (pos.x - tg.x) + Math.cos(angle) * (pos.z - tg.z) + tg.z,
    ), tg, width, height);

document.body.onload = async () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');
        const manager = new WorkerManager(4);
        const queue = new FrameQueue();

        const trydraw = () => window.requestAnimationFrame(() => {
            queue.dequeue().chunks.forEach(({ position: { x, y }, image }) => {
                ctx.putImageData(image, x, y);
            });
            trydraw();
        });

        setTimeout(trydraw);

        const scene = makeDefaultScene();
        await manager.setScene(scene);

        for (let angle = 0, frameId = 0; angle < 3 && frameId < 1; angle += 0.01, frameId++) {
            const camera = makeDefaultCamera(canvas.width, canvas.height, angle);
            await manager.setCamera(camera);

            await manager.trace(frameId).then(frame => queue.enqueue(frame));
        }

    } else {
        throw new Error('Application can not be drawn.');
    }
};
