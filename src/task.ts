import { PromiseFN, SerialTaskConfig, TaskStatus } from "./type"

export function createParallelTask<T extends any>(tasks: PromiseFN<T>[], config?: { limit: number }) {
    if (tasks.length === 0) throw new Error('tasks cannot be empty')
    const { limit = 5 } = config || {}

    return new Promise((resolve) => {
        let index = 0 // the index of next task
        let count = 0 // the count of finished tasks
        const max = Math.min(limit, tasks.length) // 
        const results = new Array(tasks.length).fill(undefined)
        async function run() {
            const i = index
            const task = tasks[i] // get current task 
            index++
            try {
                const res = await task()
                results[i] = res
            } catch (error) {
                results[i] = error
            } finally {
                count++
                if (count === tasks.length) {
                    resolve(results)
                }
                if (index < tasks.length)
                    run()
            }
        }
        for(let i = 0; i < max; i++) {
            run()
        }
    })
}

/**
 * create a serial task queue that can be interrupted
 * @param tasks need to be performed
 * @param configs task queue configs
 * @returns a run function, an abort function and a state object with status and step
 * @example
 * `
 *  const tasks = [sleep, sleep, sleep]
    const { state, run, abort } = createSerialTask(tasks, { immediate: false })
 * `
 */
export function createSerialTask<T extends any>(tasks: PromiseFN<T>[], config?: SerialTaskConfig) {
    if (tasks.length === 0) throw new Error('tasks cannot be empty')

    const { immediate = true, onAbort } = config || {}

    const state = {
        status: 'waiting' as TaskStatus,
        step: 0
    }

    function run() {
        if (state.status !== 'waiting') return
        state.status = 'pending'
        return new Promise(async (resolve, reject) => {
            for (const task of tasks) {
                state.step++
                if (state.status === 'aborted') {
                    reject(state.status)
                    break
                }
                await task()
                if (state.step === tasks.length) {
                    state.status = 'completed'
                    resolve(state.status)
                }
            }
        })
    }
    // abort task, 
    function abort() {
        state.status = 'aborted'
        onAbort?.(state.step)
    }

    if (immediate) {
        run()
    }

    return {
        run,
        abort,
        state
    }
}