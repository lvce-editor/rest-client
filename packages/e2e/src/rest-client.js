export const name = 'rest-client'

export const test = async ({ FileSystem, Main, Locator, expect }) => {
  // arrange
  const requestUrl = new URL('../fixtures/response.json', import.meta.url).href
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.rest`, `GET ${requestUrl}`)

  // act
  await Main.openUri(`${tmpDir}/test.rest`)

  // assert
  const restClient = Locator('.RestClient')
  await expect(restClient).toBeVisible()
  await expect(restClient.locator('.RestClientMethodSelect')).toHaveValue('GET')
  await expect(restClient.locator('.RestClientUrlInput')).toHaveValue(requestUrl)
  await restClient.locator('.RestClientRunButton').click()
  await expect(restClient.locator('.RestClientResponseStatus')).toHaveText('200 OK')
  await expect(restClient.locator('.RestClientResponseBody')).toHaveText('{"message":"hello-rest-client"}')
}
