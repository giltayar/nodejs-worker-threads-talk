import {on} from 'node:events'
import fastify from 'fastify'
import {fileURLToPath} from 'node:url'
import {Worker} from 'node:worker_threads'

const app = fastify()

const workers = Array(10)
  .fill(0)
  .map(
    (_) => new Worker(new URL('./image-rotation-worker.js', import.meta.url)),
  )

let nextWorker = 0

app.get('/heavy/:file', async (request, response) => {
  const params = /**@type {any}*/ (request.params)
  const imageFileUrl = new URL(`../images/${params.file}.jpg`, import.meta.url)

  const messageId = crypto.randomUUID()

  const worker = workers[(nextWorker++) % 10]

  worker.postMessage({imageFilePath: fileURLToPath(imageFileUrl), messageId})

  const {imageBuffer} = await waitForResponseMessage(worker, messageId)

  response.type('image/jpeg')
  return imageBuffer
})

await app.listen({port: parseInt(process.env.PORT ?? '3000') || 3000})

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
