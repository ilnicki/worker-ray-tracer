import { FrameQueue } from './animation/frame-queue';
import { Camera, makeCamera } from './tracer/camera';
import { fromHex } from './tracer/color';
import { makePlane } from './tracer/plane';
import { Scene } from './tracer/scene';
import { makeSphere } from './tracer/sphere';
import { WorkerManager } from './worker/worker-manager';

const makeDefaultScene = (): Scene => ({
    bodies: [
        makePlane({ x: 0.0, y: 1.0, z: 0.0 }, 0.0, 'checkerboard'),
        makeSphere({ x: 0.0, y: 1.0, z: -0.25 }, 1.0, 'shiny'),
        makeSphere({ x: -1.0, y: 0.5, z: 1.5 }, 0.5, 'shiny'),
        makeSphere({ x: -4, y: 0.7, z: -1.5 }, 0.7, 'matt'),
    ],
    lights: [
        { pos: { x: -2.0, y: 2.5, z: 0.0 }, color: fromHex('7d1212') },
        { pos: { x: 1.5, y: 2.5, z: 1.5 }, color: fromHex('12127d') },
        { pos: { x: 1.5, y: 2.5, z: -1.5 }, color: fromHex('127d12') },
        { pos: { x: 0.0, y: 3.5, z: 0.0 }, color: fromHex('363659') },
    ],
});

const pos = { x: 4.0, y: 3.0, z: 5.0 };
const tg = { x: -1.0, y: 0.5, z: 0.0 };
const makeDefaultCamera = (width: number, height: number, angle: number): Camera =>
    makeCamera({
        x: Math.cos(angle) * (pos.x - tg.x) - Math.sin(angle) * (pos.z - tg.z) + tg.x,
        y: pos.y,
        z: Math.sin(angle) * (pos.x - tg.x) + Math.cos(angle) * (pos.z - tg.z) + tg.z,
    }, tg, width, height);

document.body.onload = async () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');
        const manager = new WorkerManager(4);
        const queue = new FrameQueue();

        const trydraw = () => window.requestAnimationFrame(() => {
            queue.dequeue().forEach(({ position: { x, y }, image }) => {
                ctx.putImageData(image, x, y);
            });
            trydraw();
        });

        setTimeout(trydraw, 3000);

        const scene = makeDefaultScene();
        await manager.setScene(scene);

        for (let x = 0; x < 10; x += 0.01) {
            const camera = makeDefaultCamera(canvas.width, canvas.height, x);
            await manager.setCamera(camera);

            await manager.trace().then(frame => queue.enqueue(frame));
        }

    } else {
        throw new Error('Application can not be drawn.');
    }
};
