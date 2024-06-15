import fastify from 'fastify'
import Jimp from 'jimp'
import {fileURLToPath} from 'url'

const app = fastify()

app.get('/flip/:file', async (request, response) => {
  const params = /**@type {any}*/ (request.params)
  const imageFileUrl = new URL(`../images/${params.file}.jpg`, import.meta.url)

  const file = await Jimp.read(fileURLToPath(imageFileUrl))

  const manipulatedImage = file.clone().flip(true, false)

  const imageBuffer = await manipulatedImage.getBufferAsync(Jimp.MIME_JPEG)

  response.type('image/jpeg')

  return imageBuffer
})

await app.listen({port: parseInt(process.env.PORT ?? '3000')})
