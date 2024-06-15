import {parentPort} from 'node:worker_threads'
import {setTimeout} from 'node:timers/promises'

parentPort?.on('message', async (message) => {
  /**
   * @type {{wait: number, msgAck: Int32Array}}
   */
  const {wait, msgAck} = message

  await setTimeout(wait)

  Atomics.notify(msgAck, 0)
})
