import {computePi} from './compute-pi.js'
import {parentPort} from 'node:worker_threads'

parentPort?.on('message', async (message) => {
  /**
   * @type {{digits: number, piResultBuffer: SharedArrayBuffer, msgAck: Int32Array}}
   */
  const {digits, piResultBuffer, msgAck} = message

  const piString = computePi(digits)

  new Uint8Array(piResultBuffer).set(new TextEncoder().encode(piString))

  Atomics.store(msgAck, 0, 1)
  Atomics.notify(msgAck, 0)
})
