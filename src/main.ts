import { Camera, makeCamera } from './app/camera';
import { Plane } from './app/plane';
import { RayTracer } from './app/ray-tracer';
import { Scene } from './app/scene';
import { Sphere } from './app/sphere';
import { checkerboard, matt, shiny } from './app/surface';

function defaultScene(width: number, height: number): Scene {
    return {
        things: [new Plane({ x: 0.0, y: 1.0, z: 0.0 }, 0.0, checkerboard),
        new Sphere({ x: 0.0, y: 1.0, z: -0.25 }, 1.0, shiny),
        new Sphere({ x: -1.0, y: 0.5, z: 1.5 }, 0.5, shiny),
        new Sphere({ x: -4, y: 0.7, z: -1.5 }, 0.7, matt)],
        lights: [{ pos: { x: -2.0, y: 2.5, z: 0.0 }, color: { r: 0.49, g: 0.07, b: 0.07 } },
        { pos: { x: 1.5, y: 2.5, z: 1.5 }, color: { r: 0.07, g: 0.07, b: 0.49 } },
        { pos: { x: 1.5, y: 2.5, z: -1.5 }, color: { r: 0.07, g: 0.49, b: 0.071 } },
        { pos: { x: 0.0, y: 3.5, z: 0.0 }, color: { r: 0.21, g: 0.21, b: 0.35 } }],
        camera: makeCamera({ x: 3.0, y: 2.0, z: 4.0 }, { x: -1.0, y: 0.5, z: 0.0 }, width, height),
    };
}

document.body.onload = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas.getContext) {
        const worker = new Worker('worker.bundle.js');
        const ctx = canvas.getContext('2d');
        const rayTracer = new RayTracer();
        rayTracer.scene = defaultScene(canvas.width, canvas.height);
        rayTracer.render(ctx);
    } else {
        alert('Error: Application can not be drawn.');
    }
};
