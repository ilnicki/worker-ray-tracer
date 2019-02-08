import { FrameQueue } from './animation/frame-queue';
import { Camera, makeCamera } from './tracer/camera';
import { fromHex } from './tracer/color';
import { makePlane } from './tracer/plane';
import { Scene } from './tracer/scene';
import { makeSphere } from './tracer/sphere';
import { make } from './tracer/vector';
import { WorkerManager } from './worker/worker-manager';

const makeDefaultScene = (): Scene => ({
    bodies: [
        makePlane(make(0.0, 1.0, 0.0), 0.0, 'checkerboard'),
        makeSphere(make(0.0, 1.0, -0.25), 1.0, 'shiny'),
        makeSphere(make(-1.0, 0.5, 1.5), 0.5, 'shiny'),
        makeSphere(make(-4, 0.7, -1.5), 0.7, 'matt'),
    ],
    lights: [
        { pos: make(-2.0, 2.5, 0.0), color: fromHex('7d1212') },
        { pos: make(1.5, 2.5, 1.5), color: fromHex('12127d') },
        { pos: make(1.5, 2.5, -1.5), color: fromHex('127d12') },
        { pos: make(0.0, 3.5, 0.0), color: fromHex('363659') },
    ],
});

const pos = make(4.0, 3.0, 5.0);
const tg = make(-1.0, 0.5, 0.0);
const makeDefaultCamera = (width: number, height: number, angle: number): Camera =>
    makeCamera(make(
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

        setTimeout(trydraw, 1000);

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
