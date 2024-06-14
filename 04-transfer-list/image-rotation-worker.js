import Jimp from 'jimp'
import {parentPort} from 'node:worker_threads'

parentPort?.on('message', async ({imageFilePath, messageId}) => {
  const file = await Jimp.read(imageFilePath)

  const manipulatedImage = file.clone().flip(true, false)

  const imageBuffer = await manipulatedImage.getBufferAsync(Jimp.MIME_JPEG)

  parentPort?.postMessage({imageBuffer, messageId}, [imageBuffer.buffer])
})
