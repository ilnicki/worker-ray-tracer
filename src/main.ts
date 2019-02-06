import { Camera, makeCamera } from './tracer/camera';
import { makePlane } from './tracer/plane';
import { Scene } from './tracer/scene';
import { makeSphere } from './tracer/sphere';
import { WorkerController } from './worker/worker-controller';
import { fromHex } from './tracer/color';

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
        const wcs: WorkerController[] = Array(4).fill(null).map(() => new WorkerController());

        const scene = makeDefaultScene();
        await Promise.all(wcs.map(wc => wc.setScene(scene)));

        for (let x = 0; x < 360; x += 0.01) {
            const camera = makeDefaultCamera(canvas.width, canvas.height, x);
            await Promise.all(wcs.map(wc => wc.setCamera(camera)));

            await Promise.all(wcs.map((wc, id, { length }) =>
                wc.traceRect({
                    x: 0,
                    y: Math.floor(canvas.height / length * id),
                    w: canvas.width,
                    h: Math.ceil(canvas.height / length),
                })
            )).then(traces => window.requestAnimationFrame(() => {
                traces.forEach(({ position: { x, y }, image }) => {
                    ctx.putImageData(image, x, y);
                })
            }));
        }

    } else {
        throw new Error('Application can not be drawn.');
    }
};
