import {computePi} from './compute-pi.js'
import {parentPort} from 'node:worker_threads'

parentPort?.on('message', async ({digits, piResultBuffer, msgAck}) => {
  const piString = computePi(digits)

  new Uint8Array(piResultBuffer).set(new TextEncoder().encode(piString))

  Atomics.store(msgAck, 0, 0)
  Atomics.notify(msgAck, 0)
})
