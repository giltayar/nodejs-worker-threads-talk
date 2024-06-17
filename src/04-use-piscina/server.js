import fastify from 'fastify'
import {Piscina} from 'piscina'

const app = fastify()

const workerPool = new Piscina({
  filename: new URL('./image-rotation-worker.js', import.meta.url).href,
})

app.get('/flip/:file', async (request, response) => {
  const params = /**@type {any}*/ (request.params)
  const imageFileUrl = new URL(`../images/${params.file}.jpg`, import.meta.url).href

  const imageBuffer = await workerPool.run(imageFileUrl)

  response.type('image/jpeg')
  return imageBuffer
})

await app.listen({port: parseInt(process.env.PORT ?? '3000')})
