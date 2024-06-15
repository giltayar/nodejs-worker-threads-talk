import {computePi} from './compute-pi.js'
import {parentPort} from 'node:worker_threads'

parentPort?.on('message', async ({digits, piResultBuffer, messageId}) => {
  const piString = computePi(digits)

  const returnBufferAsArray = new Uint8Array(piResultBuffer)

  new TextEncoder().encodeInto(piString, returnBufferAsArray);

  parentPort?.postMessage({messageId})
})
