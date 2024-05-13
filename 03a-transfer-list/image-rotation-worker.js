import Jimp from 'jimp'
import {parentPort} from 'node:worker_threads'

const cache = new Map()

parentPort?.on('message', async (message) => {
  const {imageFilePath, messageId} = message

  const file = cache.get(imageFilePath) ?? await Jimp.read(imageFilePath)
  cache.set(imageFilePath, file)

  const imageBuffer = await file.clone().flip(true, false).getBufferAsync(Jimp.MIME_JPEG)

  parentPort?.postMessage({imageBuffer, messageId}, [imageBuffer.buffer])
})
