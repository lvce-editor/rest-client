import { expect, test } from '@jest/globals'
import { testWorker } from '../src/testWorker.ts'

test.skip('execute', async () => {
  const execMap = {}
  const worker = await testWorker({
    execMap,
  })
  const input = 'GET test://example.com'
  const result = await worker.execute('RestClient.execute', input)
  expect(result).toEqual({
    text: `{"key":"value"}`,
  })
})
