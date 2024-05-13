import fastify from 'fastify'
import {Worker} from 'node:worker_threads'
import crypto from 'node:crypto'

const app = fastify()

const worker = new Worker(new URL('./pi-worker.js', import.meta.url))

app.get('/pi', async (request, response) => {
  //@ts-expect-error
  const digits = request.query.digits ? parseInt(request.query.digits) : 100

  const messageId = crypto.randomUUID()

  const piResultBuffer = new SharedArrayBuffer(digits + 2)

  worker.postMessage({digits, returnBuffer: piResultBuffer, messageId})

  await waitForResponseMessage(worker, messageId)

  response.type('text/plain')
  return Buffer.from(piResultBuffer)
})

await app.listen({port: parseInt(process.env.PORT ?? '3000') || 3000})

/**
 * @param {Worker} worker
 * @param {string} messageId
 */
function waitForResponseMessage(worker, messageId) {
  return new Promise((resolve) => {
    const listener = (/** @type {{ messageId: string; }} */ message) => {
      if (message.messageId === messageId) {
        worker.off('message', listener)
        resolve(message)
      }
    }
    worker.on('message', listener)
  })
}