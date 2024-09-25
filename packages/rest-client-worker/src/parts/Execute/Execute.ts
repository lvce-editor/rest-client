const serializeHeaders = (headers: Headers) => {
  const serialized: any[] = []
  for (const [key, value] of Object.entries(headers)) {
    serialized.push({ key, value })
  }
  return serialized
}

export const execute = async (method, url) => {
  const response = await fetch(url, {
    method,
  })
  const text = await response.text()
  const { headers } = response
  const serializedHeaders = serializeHeaders(headers)
  return {
    text,
    serializedHeaders,
  }
}
