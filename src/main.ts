import { makeCamera } from './tracer/camera';
import { makePlane } from './tracer/plane';
import { Scene } from './tracer/scene';
import { makeSphere } from './tracer/sphere';
import { WorkerController } from './worker/worker-controller';

function defaultScene(width: number, height: number): Scene {
    return {
        bodies: [
            makePlane({ x: 0.0, y: 1.0, z: 0.0 }, 0.0, 'checkerboard'),
            makeSphere({ x: 0.0, y: 1.0, z: -0.25 }, 1.0, 'shiny'),
            makeSphere({ x: -1.0, y: 0.5, z: 1.5 }, 0.5, 'shiny'),
            makeSphere({ x: -4, y: 0.7, z: -1.5 }, 0.7, 'matt'),
        ],
        lights: [
            { pos: { x: -2.0, y: 2.5, z: 0.0 }, color: { r: 0.49, g: 0.07, b: 0.07 } },
            { pos: { x: 1.5, y: 2.5, z: 1.5 }, color: { r: 0.07, g: 0.07, b: 0.49 } },
            { pos: { x: 1.5, y: 2.5, z: -1.5 }, color: { r: 0.07, g: 0.49, b: 0.071 } },
            { pos: { x: 0.0, y: 3.5, z: 0.0 }, color: { r: 0.21, g: 0.21, b: 0.35 } },
        ],
        camera: makeCamera({ x: 4.0, y: 3.0, z: 5.0 }, { x: -1.0, y: 0.5, z: 0.0 }, width, height),
    };
}

document.body.onload = async () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');
        const scene = defaultScene(canvas.width, canvas.height);

        const wcs: WorkerController[] = Array(4).fill(null).map(() => new WorkerController());
        await Promise.all(wcs.map(wc => wc.setScene(scene)));

        const traces = wcs.map((wc, id, { length }) =>
            wc.traceRect({
                x: 0,
                y: Math.round(canvas.height / length * id),
                w: canvas.width,
                h: Math.round(canvas.height / length),
            }).then(({ position: { x, y }, image }) => {
                window.requestAnimationFrame(() => ctx.putImageData(image, x, y));
            })
        );
    } else {
        throw new Error('Application can not be drawn.');
    }
};
