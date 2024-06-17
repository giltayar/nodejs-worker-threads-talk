import {computePi} from './compute-pi.js'
import {parentPort} from 'node:worker_threads'

parentPort?.on('message', async ({digits, piResultBuffer, msgAck}) => {
  const piString = computePi(digits)

  const returnBufferAsArray = new Uint8Array(piResultBuffer)

  new TextEncoder().encodeInto(piString, returnBufferAsArray)

  Atomics.store(msgAck, 0, 2)
  Atomics.notify(msgAck, 0)
})
