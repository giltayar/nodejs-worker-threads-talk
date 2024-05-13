import Jimp from 'jimp'

const cache = new Map()

/**
 * @param {string} imageFilePath
 */
export default async function flip(imageFilePath) {
  const file = cache.get(imageFilePath) ?? await Jimp.read(imageFilePath)
  cache.set(imageFilePath, file)

  const imageBuffer = await file.clone().flip(true, false).getBufferAsync(Jimp.MIME_JPEG)

  return imageBuffer
}
