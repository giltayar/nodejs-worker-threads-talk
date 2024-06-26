import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs/promises'
import {$} from 'execa'
import waitPort from 'wait-port'

test('01 works', async () => {
  const command = $`node src/01-no-web-worker/server.js`

  await waitPort({host: 'localhost', port: 3000, output: 'silent'})

  const image = await fetchFlippedImage()

  assert.deepEqual(image, flippedImage)

  command.kill('SIGKILL')
  await command.catch(() => {})
})

test('02 works', async () => {
  const command = $`node src/02-simple-web-worker/server.js`

  await waitPort({host: 'localhost', port: 3000, output: 'silent'})

  const image = await fetchFlippedImage()

  assert.deepEqual(image, flippedImage)

  command.kill('SIGKILL')
  await command.catch(() => {})
})

test('03 works', async () => {
  const command = $`node src/03-web-worker-pool/server.js`

  await waitPort({host: 'localhost', port: 3000, output: 'silent'})

  const image = await fetchFlippedImage()

  assert.deepEqual(image, flippedImage)

  command.kill('SIGKILL')
  await command.catch(() => {})
})

test('04 works', async () => {
  const command = $`node src/04-use-piscina/server.js`

  await waitPort({host: 'localhost', port: 3000, output: 'silent'})

  const image = await fetchFlippedImage()

  assert.deepEqual(image, flippedImage)

  command.kill('SIGKILL')
  await command.catch(() => {})
})

test('05 works', async () => {
  const command = $`node src/05-transfer-list/server.js`

  await waitPort({host: 'localhost', port: 3000, output: 'silent'})

  const image = await fetchFlippedImage()

  assert.deepEqual(image, flippedImage)

  command.kill('SIGKILL')
  await command.catch(() => {})
})

test('06 works', async () => {
  const command = $`node src/06-pi-with-shared-array-buffer/server.js`

  await waitPort({host: 'localhost', port: 3000, output: 'silent'})

  const piResult = await fetchPi()

  assert.deepEqual(piResult, '3.1415926536')

  command.kill('SIGKILL')
  await command.catch(() => {})
})

test('07 works', async () => {
  const command = $`node src/07-pi-with-atomics/server.js`

  await waitPort({host: 'localhost', port: 3000, output: 'silent'})

  const piResult = await fetchPi()

  assert.deepEqual(piResult, '3.1415926536')

  command.kill('SIGKILL')
  await command.catch(() => {})
})

async function fetchFlippedImage() {
  const imageBuffer = await fetch('http://localhost:3000/flip/some-image').then((res) =>
    res.arrayBuffer(),
  )

  return new Uint8Array(imageBuffer)
}

async function fetchPi() {
  const text = await fetch('http://localhost:3000/pi?digits=10').then((res) => res.text())

  return text
}

const flippedImage = new Uint8Array(await fs.readFile('test/images/flipped-some-image.jpg'))
