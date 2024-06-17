import * as os from 'node:os'
import fastify from 'fastify'
import {Worker} from 'node:worker_threads'

const app = fastify()

const numberOfWebWorkers = os.availableParallelism()

const workers = Array(numberOfWebWorkers)
  .fill(0)
  .map((_) => new Worker(new URL('./pi-worker.js', import.meta.url)))

let nextWorker = 0

app.get('/pi', async (request, response) => {
  const worker = workers[nextWorker++ % numberOfWebWorkers]
  //@ts-expect-error
  const digits = request.query.digits ? parseInt(request.query.digits) : 100

  const piResultBuffer = new SharedArrayBuffer(digits + 2)
  const msgAck = new Int32Array(new SharedArrayBuffer(4))
  msgAck[0] = 1

  worker.postMessage({digits, piResultBuffer, msgAck})

  const waitResult = Atomics.waitAsync(msgAck, 0, 1)

  if (waitResult.async) {
    await waitResult.value
  }

  response.type('text/plain')
  return Buffer.from(piResultBuffer)
})

await app.listen({port: parseInt(process.env.PORT ?? '3000')})
