export const execute = async (method, url) => {
  const response = await fetch(url, {
    method,
  })
  const text = await response.text()
  return {
    text,
  }
}
