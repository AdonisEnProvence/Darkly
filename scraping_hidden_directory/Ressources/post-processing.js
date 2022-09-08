import { readFile } from 'fs/promises'

const results = await readFile('./results.txt', 'utf-8')

const lines = results.split('\n')

console.log('line with numbers', lines.find((line) => /\d/.test(line)))
