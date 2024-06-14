import {once} from 'events'
import fastify from 'fastify'
import fs from 'fs'
import {fileURLToPath} from 'node:url'
import {Worker} from 'node:worker_threads'
import crypto from 'node:crypto'

const app = fastify()

const worker = new Worker(
  new URL('./image-rotation-worker.js', import.meta.url),
)

app.get('/heavy/:file', async (request, response) => {
  const params = /**@type {any}*/ (request.params)
  const imageFileUrl = new URL(`../images/${params.file}.jpg`, import.meta.url)

  const messageId = crypto.randomUUID()

  worker.postMessage({imageFilePath: fileURLToPath(imageFileUrl), messageId})

  function findMessage() {
    return new Promise((resolve) => {
      const listener = (/** @type {{ messageId: string; }} */ message) => {
        if (message.messageId === messageId) {
          worker.off('message', listener)
          resolve(message)
        }
      };
      worker.on('message', listener)
    })
  }
  const {imageBuffer} = await findMessage()

  response.type('image/jpeg')
  return imageBuffer
})

await app.listen({port: parseInt(process.env.PORT ?? '3000') || 3000})
