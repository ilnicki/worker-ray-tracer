import { Body, BodyHandler, BodyHandlerRegistry, registry as bodyRegistry } from './body';
import * as c from './color';
import { Intersection } from './intersection';
import { Light } from './light';
import { Ray } from './ray';
import { Scene } from './scene';
import { registry as surfaceRegistry, SurfaceRegistry } from './surface';
import { dot, mag, minus, norm, plus, times, Vector } from './vector';

export class RayTracer {
    public scene: Scene;
    private maxDepth = 5;
    private surfaces: SurfaceRegistry = surfaceRegistry;
    private bodies: BodyHandlerRegistry = bodyRegistry;

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
        return this.scene.bodies
            .map(body => (this.bodies[body.handlerId] as BodyHandler).intersect(ray, body))
            .reduce((closest, inter) => (!closest || inter && inter.dist < closest.dist) ? inter : closest, null);

        // let closest: Intersection;
        // for (const body of this.scene.bodies) {
        //     const inter = (this.bodies[body.handlerId] as BodyHandler).intersect(ray, body);
        //     if (!closest || (inter && inter.dist < closest.dist)) {
        //         closest = inter;
        //     }
        // }
        // return closest;
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
        const dir = isect.ray.dir;
        const bodyHandler = this.bodies[isect.body.handlerId] as BodyHandler;

        const pos = plus(times(isect.dist, dir), isect.ray.start);
        const normal = bodyHandler.normal(pos, isect.body);
        const reflectDir = minus(dir, times(2, times(dot(normal, dir), normal)));

        const naturalColor = c.plus(
            c.background,
            this.getNaturalColor(isect.body, pos, normal, reflectDir)
        );
        const reflectedColor = (depth >= this.maxDepth)
            ? c.grey
            : this.getReflectionColor(isect.body, pos, reflectDir, depth);
        return c.plus(naturalColor, reflectedColor);
    }

    private getReflectionColor(body: Body, pos: Vector, rd: Vector, depth: number) {
        return c.scale(
            this.surfaces[body.surfaceId].reflect(pos),
            this.traceRay({ start: pos, dir: rd }, depth + 1)
        );
    }

    private getNaturalColor(body: Body, pos: Vector, normal: Vector, rd: Vector) {
        const surface = this.surfaces[body.surfaceId];

        return this.scene.lights.reduce((col: c.Color, light: Light) => {
            const ldis = minus(light.pos, pos);
            const livec = norm(ldis);
            const neatIsect = this.testRay({ start: pos, dir: livec });
            const isInShadow = neatIsect && mag(ldis) > neatIsect;

            if (isInShadow) {
                return col;
            } else {
                const illum = dot(livec, normal);
                const lcolor = (illum > 0)
                    ? c.scale(illum, light.color)
                    : c.defaultColor;

                const specular = dot(livec, norm(rd));
                const scolor = (specular > 0)
                    ? c.scale(specular ** surface.roughness, light.color)
                    : c.defaultColor;

                return c.plus(
                    col,
                    c.plus(
                        c.times(surface.diffuse(pos), lcolor),
                        c.times(surface.specular(pos), scolor)
                    )
                );
            }
        }, c.defaultColor);
    }
}
