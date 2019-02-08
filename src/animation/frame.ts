import { Chunk } from './chunk';

export interface Frame {
    id?: number;
    chunks: Chunk[];
};
