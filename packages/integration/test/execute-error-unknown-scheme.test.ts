import { expect, test } from '@jest/globals'
import { testWorker } from '../src/testWorker.ts'

test('execute - error - unknown scheme', async () => {
  const execMap = {
    'Request.request'() {
      throw new Error('fetch failed: unknown scheme')
    },
  }
  const worker = await testWorker({
    execMap,
  })
  const input = 'GET test://example.com'

  await expect(worker.execute('RestClient.execute', input)).rejects.toThrow(new Error('fetch failed'))
})
