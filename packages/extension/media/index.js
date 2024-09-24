// TODO use virtual dom in  worker

const handleSubmit = async (event) => {
  console.log('handle submit')
  event.preventDefault()
  const input = document.getElementById('Input')
  if (!input) {
    throw new Error('input not found')
  }
  // @ts-ignore
  await rpc.invoke('handleSubmit', input.value)
}

const initialize = (inputValue) => {
  const app = document.createElement('div')
  app.className = 'App'

  const heading = document.createElement('h1')
  heading.textContent = 'Rest Client'

  const input = document.createElement('input')
  input.value = inputValue
  input.id = 'Input'

  const button = document.createElement('button')
  button.textContent = 'run'

  const form = document.createElement('form')
  form.append(input, button)

  const output = document.createElement('output')
  output.id = 'Output'

  app.append(heading, form, output)

  document.body.append(app)
}

const setOutput = (value) => {
  const output = document.getElementById('Output')
  if (!output) {
    throw new Error('output not found')
  }
  output.textContent = value
}

const rpc = globalThis.lvceRpc({
  initialize,
  setOutput,
})
