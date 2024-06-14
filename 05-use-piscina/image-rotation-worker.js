import Jimp from 'jimp'

/**
 * @param {string} imageFilePath
 */
export default async function flip(imageFilePath) {
  const file = await Jimp.read(imageFilePath)

  const manipulatedImage = file.clone().flip(true, false)

  const imageBuffer = await manipulatedImage.getBufferAsync(Jimp.MIME_JPEG)

  return imageBuffer
}
