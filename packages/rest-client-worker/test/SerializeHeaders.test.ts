import { expect, test } from '@jest/globals'
import * as SerializeHeaders from '../src/parts/SerializeHeaders/SerializeHeaders.ts'

test('serializeHeaders', async () => {
  const headers = new Headers()
  headers.set('key', 'value')
  expect(SerializeHeaders.serializeHeaders(headers)).toEqual([
    {
      key: 'key',
      value: 'value',
    },
  ])
})
