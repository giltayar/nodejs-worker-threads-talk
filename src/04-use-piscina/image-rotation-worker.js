import Jimp from 'jimp'
import {fileURLToPath} from 'node:url'

/**
 * @param {string} imageFileUrl
 */
export default async function flip(imageFileUrl) {
  const file = await Jimp.read(fileURLToPath(imageFileUrl))

  const manipulatedImage = file.clone().flip(true, false)

  const imageBuffer = await manipulatedImage.getBufferAsync(Jimp.MIME_JPEG)

  return imageBuffer
}
