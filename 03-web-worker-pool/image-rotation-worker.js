import Jimp from 'jimp'
import {parentPort} from 'node:worker_threads'
import {fileURLToPath} from 'node:url'

parentPort?.on('message', async ({imageFileUrl, messageId}) => {
  const file = await Jimp.read(fileURLToPath(imageFileUrl))

  const manipulatedImage = file.clone().flip(true, false)

  const imageBuffer = await manipulatedImage.getBufferAsync(Jimp.MIME_JPEG)

  parentPort?.postMessage({imageBuffer, messageId})
})
