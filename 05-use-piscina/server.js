import fastify from 'fastify'
import fs from 'fs'
import {fileURLToPath} from 'node:url'
import {Worker} from 'node:worker_threads'
import {Piscina} from 'piscina'

const app = fastify()

const workerPool = new Piscina({
  filename: new URL('./image-rotation-worker.js', import.meta.url).href,
})

app.get('/image/:file', (request, response) => {
  const params = /**@type {any}*/ (request.params)
  const imageFileUrl = new URL(`../images/${params.file}.jpg`, import.meta.url)

  response.type('image/jpeg')

  response.send(fs.createReadStream(imageFileUrl))
})

app.get('/heavy/:file', async (request, response) => {
  const params = /**@type {any}*/ (request.params)
  const imageFileUrl = new URL(`../images/${params.file}.jpg`, import.meta.url)

  const imageBuffer = await workerPool.run(fileURLToPath(imageFileUrl))

  response.type('image/jpeg')
  return imageBuffer
})

await app.listen({port: parseInt(process.env.PORT ?? '3000') || 3000})
