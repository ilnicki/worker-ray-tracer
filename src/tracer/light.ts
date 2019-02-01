import { Color } from './color';
import { Vector } from './vector';

export interface Light {
    pos: Vector;
    color: Color;
}
