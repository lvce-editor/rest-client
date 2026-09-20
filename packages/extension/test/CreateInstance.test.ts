import { expect, test } from '@jest/globals'
import { createInstanceWithDependencies } from '../src/parts/RestClientView/CreateInstance.ts'

const createContext = (uri: string) => ({
  requestRerender: async (): Promise<void> => {},
  showContextMenu: async (): Promise<void> => {},
  uid: 1,
  uri,
  viewId: 'builtin.rest-client',
})

const getNodeByClass = (nodes: readonly Record<string, unknown>[], className: string) => {
  return nodes.find((node) => node.className === className)
}

test('create instance reads and renders the request for its own uri', async () => {
  const instance = await createInstanceWithDependencies(createContext('one.rest'), {
    async executeRequest() {
      return {
        serializedHeaders: [],
        status: 200,
        statusText: 'OK',
        text: 'response',
      }
    },
    async readFile(uri) {
      return uri === 'one.rest' ? 'POST data:text/plain,one' : 'GET data:text/plain,two'
    },
  })

  const input = getNodeByClass(instance.render(), 'RestClientUrlInput')
  expect(input).toMatchObject({ value: 'data:text/plain,one' })
  expect(instance.saveState()).toEqual({
    method: 'POST',
    uri: 'one.rest',
    url: 'data:text/plain,one',
  })
})

test('create instance executes edited requests and renders failures', async () => {
  const requests: string[] = []
  let rerenders = 0
  const instance = await createInstanceWithDependencies(
    {
      ...createContext('test.rest'),
      requestRerender: async (): Promise<void> => {
        rerenders++
      },
    },
    {
      async executeRequest(method, url) {
        requests.push(`${method} ${url}`)
        if (url === 'invalid://url') {
          throw new Error('request failed')
        }
        return {
          serializedHeaders: [{ key: 'content-type', value: 'text/plain' }],
          status: 200,
          statusText: 'OK',
          text: 'hello',
        }
      },
      async readFile() {
        return 'GET data:text/plain,initial'
      },
    },
  )

  await instance.handleEvent({ name: 'url', type: 'input', value: 'data:text/plain,edited' })
  await instance.handleEvent({ name: 'method', type: 'change', value: 'PUT' })
  await instance.handleEvent({ name: 'run', type: 'click' })
  await new Promise((resolve) => setTimeout(resolve, 0))

  expect(requests).toEqual(['PUT data:text/plain,edited'])
  expect(getNodeByClass(instance.render(), 'RestClientResponseBody')).toMatchObject({
    childCount: 1,
  })
  expect(rerenders).toBe(2)

  await instance.handleEvent({ name: 'url', type: 'input', value: 'invalid://url' })
  await instance.handleEvent({ name: 'run', type: 'click' })
  await new Promise((resolve) => setTimeout(resolve, 0))
  expect(getNodeByClass(instance.render(), 'RestClientError')).toBeDefined()
})
