/**
 * wait for a certain amount of time (default is 100 milliseconds)
 * @param delay 
 * @returns 
 */
export function sleep(delay: number = 100): Promise<any> {
    // 返回一个Promise，在指定的延迟时间后执行resolve
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    })
}


export const isString = (val: unknown): val is string => typeof val === 'string'