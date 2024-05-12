import fastify from 'fastify'
import fs from 'fs'
import Jimp from 'jimp'
import {fileURLToPath} from 'url'

const app = fastify()



app.get('/image/:file', (request, response) => {
  const imageFileUrl = new URL(
    //@ts-expect-error
    `../images/${request.params.file}.jpg`,
    import.meta.url,
  )

  response.type('image/jpeg')

  response.send(fs.createReadStream(imageFileUrl))
})

const cache = new Map()

app.get('/heavy/:file', async (request, response) => {
  const imageFileUrl = new URL(
    //@ts-expect-error
    `../images/${request.params.file}.jpg`,
    import.meta.url,
  )

  const file = cache.get(imageFileUrl.href) ?? await Jimp.read(fileURLToPath(imageFileUrl))
  cache.set(imageFileUrl.href, file)

  const imageBuffer = await file.clone().flip(true, false).getBufferAsync(Jimp.MIME_JPEG)

  response.type('image/jpeg')

  return imageBuffer;
})

await app.listen({port: parseInt(process.env.PORT ?? '3000') || 3000})
