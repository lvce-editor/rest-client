import { id } from '../Id/Id.ts'

export const wrapCommand = (fn) => {
  return async (...args) => {
    await fn(id, ...args)
  }
}
