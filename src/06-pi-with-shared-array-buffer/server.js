import * as os from 'node:os'
import fastify from 'fastify'
import {Worker} from 'node:worker_threads'
import crypto from 'node:crypto'
import {computePi} from './compute-pi.js'
import {on} from 'node:events'

const app = fastify()

const numberOfWebWorkers = os.availableParallelism()

const workers = Array(numberOfWebWorkers)
  .fill(0)
  .map(() => new Worker(new URL('./pi-worker.js', import.meta.url)))

let nextWorker = 0

app.get('/pi-sync', async (request, response) => {
  //@ts-expect-error
  const digits = request.query.digits ? parseInt(request.query.digits) : 100

  const result = computePi(digits)

  response.type('text/plain')
  return Buffer.from(result)
})

app.get('/pi', async (request, response) => {
  const worker = workers[nextWorker++ % numberOfWebWorkers]
  //@ts-expect-error
  const digits = request.query.digits ? parseInt(request.query.digits) : 100

  const piResultBuffer = new SharedArrayBuffer(digits + 2)

  const messageId = crypto.randomUUID()
  worker.postMessage({digits, piResultBuffer, messageId})

  await waitForResponseMessage(worker, messageId)

  response.type('text/plain')
  return Buffer.from(piResultBuffer)
})

await app.listen({port: parseInt(process.env.PORT ?? '3000')})

/**
 * @param {Worker} worker
 * @param {string} messageId
 */
async function waitForResponseMessage(worker, messageId) {
  for await (const [message] of on(worker, 'message')) {
    if (message.messageId === messageId) {
      return message
    }
  }
}
