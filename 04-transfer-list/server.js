import {once} from 'events'
import fastify from 'fastify'
import fs from 'fs'
import {fileURLToPath} from 'node:url'
import {Worker} from 'node:worker_threads'

const app = fastify()

const workers = Array(10)
  .fill(0)
  .map(
    (_) => new Worker(new URL('./image-rotation-worker.js', import.meta.url)),
  )

let nextWorker = 0

app.get('/image/:file', (request, response) => {
  const imageFileUrl = new URL(
    //@ts-expect-error
    `../images/${request.params.file}.jpg`,
    import.meta.url,
  )

  response.type('image/jpeg')

  response.send(fs.createReadStream(imageFileUrl))
})

app.get('/heavy/:file', async (request, response) => {
  const imageFileUrl = new URL(
    //@ts-expect-error
    `../images/${request.params.file}.jpg`,
    import.meta.url,
  )

  const messageId = crypto.randomUUID()

  const worker = workers[nextWorker++ % 10]

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
