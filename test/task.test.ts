import { describe, it, expect } from 'vitest'
import { createParallelTask, createSerialTask } from '../src/task';
import { sleep } from '../src';

describe('Serial Task', async () => {
  it('complete', async () => {
    const tasks = [sleep, sleep, sleep]
    const { state, run } = createSerialTask(tasks, { immediate: false })
    await run()
    expect(state).toMatchInlineSnapshot(`
      {
        "status": "completed",
        "step": 3,
      }
    `)
  })


  it('abort', async () => {
    const temp: any = []
    const tasks = [() => sleep(1000), () => sleep(1000), () => sleep(1000)]

    const { run, abort, state } = createSerialTask(tasks)
    run()
    await sleep(500)
    abort()
    expect(state).toMatchInlineSnapshot(`
      {
        "status": "aborted",
        "step": 1,
      }
    `)
    expect(temp).toMatchInlineSnapshot(`[]`)
  })
})


describe('Parallel Task', async () => {
  it('parallel task', async () => {
    const tasks = Array.from({ length: 20 }, () => sleep)
    const res = await createParallelTask(tasks)
  })
})