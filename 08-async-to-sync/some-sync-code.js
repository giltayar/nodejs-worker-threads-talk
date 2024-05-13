import {Worker} from 'worker_threads'

const worker = new Worker(new URL('wait-worker.js', import.meta.url))
worker.unref()

/**
 * @param {number} ms
 */
function waitSync(ms) {

  const msgAck = new Int32Array(new SharedArrayBuffer(4))

  worker.postMessage({msgAck, wait: ms})

  Atomics.wait(msgAck, 0, 0)
}

console.time('waiting')
waitSync(2000)
console.timeEnd('waiting')

