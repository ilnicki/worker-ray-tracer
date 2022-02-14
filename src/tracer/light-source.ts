import { Color } from '../math/color';
import { Vector } from '../math/vector';

export interface LightSource {
    pos: Vector;
    color: Color;
}

export const light = (pos: Vector, color: Color): LightSource => ({
    pos,
    color
})
