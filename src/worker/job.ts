export enum JobType {
    SetScene,
    TraceRect,
}

export interface Job<T = any> {
    readonly id: number;
    readonly type: JobType;
    readonly payload: T;
}

export interface JobResult<T = any> {
    readonly id: number;
    readonly payload: T;
}
