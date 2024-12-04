export const newline = '\r\n'
export const doubleNewline = newline + newline
export const coord = ([x, y]) => `${x},${y}`
export const coord3 = ([x, y, z]) => `${x},${y},${z}`
export const getLines = (input) => input.split(newline)
export const getGroups = (input) => input.split(doubleNewline)
export const getCharacters = (input) => input.split('')

export { md5 } from './md5.js'