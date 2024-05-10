import fastify from 'fastify'
import fs from 'fs'
import Jimp from 'jimp'

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

app.get('/heavy/:file', async (request, response) => {
  const imageFileUrl = new URL(
    //@ts-expect-error
    `../images/${request.params.file}.jpg`,
    import.meta.url,
  )

  const file = await Jimp.read(imageFileUrl.pathname)

  console.time('a')
  const imageBuffer = file.rotate(-45).getBufferAsync(Jimp.MIME_JPEG)
  console.timeEnd('a')

  response.type('image/jpeg')

  return imageBuffer;
})

await app.listen({port: parseInt(process.env.PORT ?? '3000') || 3000})
