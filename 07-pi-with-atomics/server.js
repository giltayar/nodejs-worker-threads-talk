import fastify from 'fastify'
import {Worker} from 'node:worker_threads'

const app = fastify()

const worker = new Worker(new URL('./pi-worker.js', import.meta.url))

app.get('/pi', async (request, response) => {
  //@ts-expect-error
  const digits = request.query.digits ? parseInt(request.query.digits) : 100

  const piResultBuffer = new SharedArrayBuffer(digits + 2)
  const msgAck = new Int32Array(new SharedArrayBuffer(4))

  worker.postMessage({digits, piResultBuffer, msgAck})

  const waitResult = Atomics.waitAsync(msgAck, 0, 0)

  if (waitResult.async) {
    await waitResult.value
  }

  response.type('text/plain')
  return Buffer.from(piResultBuffer)
})

await app.listen({port: parseInt(process.env.PORT ?? '3000') || 3000})
