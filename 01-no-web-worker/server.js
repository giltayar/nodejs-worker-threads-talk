import fastify from 'fastify'
import fs from 'fs'
import Jimp from 'jimp'
import {fileURLToPath} from 'url'

const app = fastify()

app.get('/image/:file', (request, response) => {
  const params = /**@type {any}*/ (request.params)
  const imageFileUrl = new URL(`../images/${params.file}.jpg`, import.meta.url)

  response.type('image/jpeg')

  response.send(fs.createReadStream(imageFileUrl))
})

app.get('/heavy/:file', async (request, response) => {
  const params = /**@type {any}*/ (request.params)
  const imageFileUrl = new URL(`../images/${params.file}.jpg`, import.meta.url)

  const file = await Jimp.read(fileURLToPath(imageFileUrl))

  const manipulatedImage = file.clone().flip(true, false)

  const imageBuffer = await manipulatedImage.getBufferAsync(Jimp.MIME_JPEG)

  response.type('image/jpeg')

  return imageBuffer
})

await app.listen({port: parseInt(process.env.PORT ?? '3000') || 3000})
