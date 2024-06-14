import {computePi} from './compute-pi.js'
import {parentPort} from 'node:worker_threads'

parentPort?.on('message', async ({digits, returnBuffer, messageId}) => {
  const piString = computePi(digits)

  new Int8Array(returnBuffer).set(new TextEncoder().encode(piString))

  parentPort?.postMessage({messageId})
})
