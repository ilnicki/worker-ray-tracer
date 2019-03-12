import { Color } from '../math/color';
import { Vector } from '../math/vector';

export interface Light {
    pos: Vector;
    color: Color;
}
