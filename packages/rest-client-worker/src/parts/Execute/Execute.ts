export const execute = async (input) => {
  const [method, url] = input.split(' ')
  const response = await fetch(url, {
    method,
  })
  const text = await response.text()
  return {
    text,
  }
}
