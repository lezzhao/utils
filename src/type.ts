
export type PromiseFN<T extends any> = (...args: any[]) => Promise<T>;

export type TaskStatus = 'waiting' | 'pending' | 'completed' | 'aborted'

export interface SerialTaskConfig {
    immediate?: boolean,
    onAbort?: (step: number) => void,
}