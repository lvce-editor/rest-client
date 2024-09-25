import * as SerializeHeaders from '../SerializeHeaders/SerializeHeaders.ts'

export const execute = async (method, url) => {
  const response = await fetch(url, {
    method,
  })
  const text = await response.text()
  const { headers } = response
  const serializedHeaders = SerializeHeaders.serializeHeaders(headers)
  return {
    text,
    serializedHeaders,
  }
}
