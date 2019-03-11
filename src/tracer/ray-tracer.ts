import { Body } from './bodies/body';
import { getBodyHandler } from './bodies/handlers';
import * as c from './color';
import { Intersection } from './intersection';
import { Light } from './light';
import { Ray } from './ray';
import { Scene } from './scene';
import { getSurfaceHandler } from './surfaces/handlers';
import { dot, mag, minus, norm, plus, times, Vector } from './vector';

export class RayTracer {
    public scene: Scene;
    private maxDepth = 5;

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
                    times(
                        (x - (this.scene.camera.width / 2.0)) / 2.0 / this.scene.camera.width,
                        this.scene.camera.right
                    ),
                    times(
                        -(y - (this.scene.camera.height / 2.0)) / 2.0 / this.scene.camera.height,
                        this.scene.camera.up
                    )
                )
            )
        );
    }

    private intersections(ray: Ray): Intersection {
        const closest: Intersection = {
            body: null,
            ray,
            dist: Infinity,
        };

        for (const body of this.scene.bodies) {
            const interDist = getBodyHandler(body).intersect(ray, body);
            if (!closest || (interDist !== null && interDist < closest.dist)) {
                closest.dist = interDist;
                closest.body = body;
            }
        }

        return closest.body && closest;
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
        const pos = plus(times(isect.dist, dir), isect.ray.start);
        const bodyHandler = getBodyHandler(isect.body);
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
            getSurfaceHandler(body.surface).reflect(body.surface, pos),
            this.traceRay({ start: pos, dir: rd }, depth + 1)
        );
    }

    private getNaturalColor(body: Body, pos: Vector, normal: Vector, rd: Vector) {
        const surfaceHandler = getSurfaceHandler(body.surface);

        return this.scene.lights.reduce((color: c.Color, light: Light) => {
            const lightDistance = minus(light.pos, pos);
            const lightDirection = norm(lightDistance);

            const neatIsect = this.testRay({ start: pos, dir: lightDirection });
            const isInShadow = !neatIsect ? false : (neatIsect <= mag(lightDistance));

            if (isInShadow) {
                return color;
            } else {
                const illumination = dot(lightDirection, normal);
                const lightColor = (illumination > 0)
                    ? c.scale(illumination, light.color)
                    : c.defaultColor;
                const specular = dot(lightDirection, norm(rd));
                const specularColor = (specular > 0)
                    ? c.scale(
                        specular ** surfaceHandler.roughness(body.surface, pos),
                        light.color
                    ) : c.defaultColor;
                return c.plus(
                    color,
                    c.plus(
                        c.times(surfaceHandler.diffuse(body.surface, pos), lightColor),
                        c.times(surfaceHandler.specular(body.surface, pos), specularColor)
                    )
                );
            }
        }, c.defaultColor);
    }
}
