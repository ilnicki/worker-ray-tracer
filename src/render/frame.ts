import { Chunk } from './chunk';

export interface Frame {
    readonly chunks: Chunk[];
}
