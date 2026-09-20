export const name = 'rest-client'

export const test = async ({ FileSystem, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.rest`, `GET data:text/plain,hello-rest-client`)

  // act
  await Main.openUri(`${tmpDir}/test.rest`)

  // assert
  const restClient = Locator('.RestClient')
  await expect(restClient).toBeVisible()
  await expect(restClient.locator('.RestClientMethodSelect')).toHaveValue('GET')
  await expect(restClient.locator('.RestClientUrlInput')).toHaveValue('data:text/plain,hello-rest-client')
  await restClient.locator('.RestClientRunButton').click()
  await expect(restClient.locator('.RestClientResponseStatus')).toHaveText('200')
  await expect(restClient.locator('.RestClientResponseBody')).toHaveText('hello-rest-client')
}
