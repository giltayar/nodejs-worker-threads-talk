import {computePi} from './compute-pi.js'
import {parentPort} from 'node:worker_threads'

parentPort?.on('message', async (message) => {
  /**
   * @type {{digits: number, returnBuffer: SharedArrayBuffer, messageId: string}}
   */
  const {digits, returnBuffer, messageId} = message

  const piString = computePi(digits)

  new Uint8Array(returnBuffer).set(new TextEncoder().encode(piString))

  parentPort?.postMessage({messageId})
})
