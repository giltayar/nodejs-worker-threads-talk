import Jimp from 'jimp'

/**
 * @param {string} imageFilePath
 */
export default async function flip(imageFilePath) {
  const file = await Jimp.read(imageFilePath)

  const imageBuffer = await file.clone().flip(true, false).getBufferAsync(Jimp.MIME_JPEG)

  return imageBuffer
}
