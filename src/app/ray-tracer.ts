import { Camera, iterate } from './camera';
import * as c from './color';
import { Intersection } from './intersection';
import { Light } from './light';
import { Ray } from './ray';
import { Scene } from './scene';
import { Thing } from './thing';
import { dot, mag, minus, norm, plus, times, Vector } from './vector';

export class RayTracer {
    public scene: Scene;
    private maxDepth = 5;

    public render(ctx: CanvasRenderingContext2D): void {
        for (const [x, y] of iterate(this.scene.camera)) {
            const color = this.tracePoint(x, y);

            ctx.fillStyle = c.toString(color);
            ctx.fillRect(x, y, 1, 1);
        }
    }

    public tracePoint(x: number, y: number): c.Color {
        return c.toDrawingColor(this.traceRay({
            start: this.scene.camera.pos,
            dir: this.getPoint(x, y),
        }, 0));
    }

    private getPoint(x: number, y: number): Vector {
        return norm(
            plus(
                this.scene.camera.forward,
                plus(
                    times((x - (this.scene.camera.width / 2.0)) / 2.0 / this.scene.camera.width,
                        this.scene.camera.right),
                    times(-(y - (this.scene.camera.height / 2.0)) / 2.0 / this.scene.camera.height,
                        this.scene.camera.up)
                )
            )
        );
    }

    private intersections(ray: Ray): Intersection {
        return this.scene.things.map(thing => thing.intersect(ray)).reduce((closest, inter) =>
            (!closest || inter && inter.dist < closest.dist) ? inter : closest, null);
    }

    private testRay(ray: Ray): number {
        const isect = this.intersections(ray);
        return isect ? isect.dist : null;
    }

    private traceRay(ray: Ray, depth: number): c.Color {
        const isect = this.intersections(ray);
        return isect ? this.shade(isect, depth) : c.background;
    }

    private shade(isect: Intersection, depth: number) {
        const d = isect.ray.dir;
        const pos = plus(times(isect.dist, d), isect.ray.start);
        const normal = isect.thing.normal(pos);
        const reflectDir = minus(d,
            times(2, times(dot(normal, d), normal)));
        const naturalColor = c.plus(c.background,
            this.getNaturalColor(isect.thing, pos, normal, reflectDir));
        const reflectedColor = (depth >= this.maxDepth)
            ? c.grey
            : this.getReflectionColor(isect.thing, pos, normal, reflectDir, depth);
        return c.plus(naturalColor, reflectedColor);
    }

    private getReflectionColor(thing: Thing, pos: Vector, normal: Vector, rd: Vector, depth: number) {
        return c.scale(
            thing.surface.reflect(pos),
            this.traceRay({ start: pos, dir: rd }, depth + 1)
        );
    }

    private getNaturalColor(thing: Thing, pos: Vector, normal: Vector, rd: Vector) {
        return this.scene.lights.reduce((col: c.Color, light: Light) => {
            const ldis = minus(light.pos, pos);
            const livec = norm(ldis);
            const neatIsect = this.testRay({ start: pos, dir: livec });
            const isInShadow = !neatIsect ? false : (neatIsect <= mag(ldis));
            if (isInShadow) {
                return col;
            } else {
                const illum = dot(livec, normal);
                const lcolor = (illum > 0) ? c.scale(illum, light.color)
                    : c.defaultColor;
                const specular = dot(livec, norm(rd));
                const scolor = (specular > 0)
                    ? c.scale(Math.pow(specular, thing.surface.roughness), light.color)
                    : c.defaultColor;
                return c.plus(
                    col,
                    c.plus(
                        c.times(thing.surface.diffuse(pos), lcolor),
                        c.times(thing.surface.specular(pos), scolor)
                    )
                );
            }
        }, c.defaultColor);
    }
}
