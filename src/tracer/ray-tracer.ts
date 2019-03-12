import { background, Color, defaultColor, grey, mul, scale, sum, toDrawingColor } from '../math/color';
import { dot, mag, minus, norm, plus, times, Vector } from '../math/vector';
import { getBodyHandler } from './bodies/handlers';
import { cameraRay } from './camera';
import { detectIntersection, Intersection } from './intersection';
import { Light } from './light';
import { Ray } from './ray';
import { Scene } from './scene';
import { getSurfaceHandler } from './surfaces/handlers';
import { Surface } from './surfaces/surface';

export class RayTracer {
    public scene: Scene;
    private maxDepth = 5;

    public tracePoint(x: number, y: number): Color {
        return toDrawingColor(
            this.traceRay(cameraRay(this.scene.camera, x, y), 0)
        );
    }

    private testRay(ray: Ray): number {
        const isect = detectIntersection(ray, this.scene.bodies);
        return isect ? isect.dist : null;
    }

    private traceRay(ray: Ray, depth: number): Color {
        const isect = detectIntersection(ray, this.scene.bodies);
        return isect ? this.shade(isect, depth) : background;
    }

    private shade(isect: Intersection, depth: number) {
        const dir = isect.ray.dir;
        const pos = plus(times(isect.dist, dir), isect.ray.start);
        const bodyHandler = getBodyHandler(isect.body);
        const normal = bodyHandler.normal(pos, isect.body);
        const reflectDir = minus(dir, times(2, times(dot(normal, dir), normal)));

        const naturalColor = sum(
            background,
            this.getNaturalColor(isect.body.surface, pos, normal, reflectDir)
        );
        const reflectedColor = (depth >= this.maxDepth)
            ? grey
            : this.getReflectionColor(isect.body.surface, pos, reflectDir, depth);
        return sum(naturalColor, reflectedColor);
    }

    private getReflectionColor(surface: Surface, pos: Vector, reflectDir: Vector, depth: number) {
        return scale(
            this.traceRay({ start: pos, dir: reflectDir }, depth + 1),
            getSurfaceHandler(surface).reflect(surface, pos),
        );
    }

    private getNaturalColor(surface: Surface, pos: Vector, normal: Vector, reflectDir: Vector) {
        const surfaceHandler = getSurfaceHandler(surface);

        return this.scene.lights.reduce((color: Color, light: Light) => {
            const lightDistance = minus(light.pos, pos);
            const lightDirection = norm(lightDistance);

            const neatIsect = this.testRay({ start: pos, dir: lightDirection });
            const isInShadow = !neatIsect ? false : (neatIsect <= mag(lightDistance));

            if (isInShadow) {
                return color;
            } else {
                const illumination = dot(lightDirection, normal);
                const lightColor = (illumination > 0)
                    ? scale(light.color, illumination)
                    : defaultColor;
                const specular = dot(lightDirection, norm(reflectDir));
                const specularColor = (specular > 0)
                    ? scale(
                        light.color,
                        specular ** surfaceHandler.roughness(surface, pos),
                    )
                    : defaultColor;
                return sum(
                    color,
                    sum(
                        mul(surfaceHandler.diffuse(surface, pos), lightColor),
                        mul(surfaceHandler.specular(surface, pos), specularColor)
                    )
                );
            }
        }, defaultColor);
    }
}
