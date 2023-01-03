import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, newline } from '../../common/common.js';

function preProcessForPart1(input) {
    return input
}

function incrementString(input) {
    let split = input.split('')
    let ascii = split.map(x => x.charCodeAt(0) - 97)
    ascii.reverse()
    ascii[0]++
    for (let i = 0; i < ascii.length; i++) {

        if (ascii[i] < 26) {
            continue
        }

        ascii[i] = 0
        if (ascii[i + 1] === undefined) {
            ascii[i + 1] = -1
        }
        ascii[i + 1] += 1
    }
    ascii.reverse()
    let chars = ascii.map(x => String.fromCharCode(x + 97))
    return chars.join('')
}

const twoRepeatingPairs = /([\w])\1.*([\w])\2/
function isPart1Password(input) {
    const illegalChars = ['i', 'o', 'l']
    const meetsConditionTwo = !illegalChars.find(x => ~input.indexOf(x))
    if (!meetsConditionTwo) return false

    const meetsConditionThree = twoRepeatingPairs.test(input)
    if (!meetsConditionThree) return false

    const nextChar = (char) => String.fromCharCode(char.charCodeAt(0) + 1)
    const meetsConditionOne = input
        .split('')
        .find((char, index, chars) => char
            && chars[index + 1] && chars[index + 1] == nextChar(char)
            && chars[index + 2] && chars[index + 2] == nextChar(chars[index + 1])
        )
    return meetsConditionOne
}

function part1(data) {
    let currentPassword = data
    let valid = isPart1Password(currentPassword)
    while (!valid) {
        currentPassword = incrementString(currentPassword)
        valid = isPart1Password(currentPassword)
    }
    return currentPassword
}

function part2(data) {
    return part1(incrementString(data))

}

function run(input) {
    let t0 = performance.now()

    let preProcessedInput1 = preProcessForPart1(input)
    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    let result1 = part1(preProcessedInput1)
    let t2 = performance.now()
    console.log(`11a: ${~~(t2 - t1)}ms ${result1}`);

    let result2 = part2(result1)
    let t3 = performance.now()
    console.log(`11b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    // readFile('./2015/day-11/data-test-day-11.txt').then(value => run(value.toString()));
    readFile('./2015/day-11/data-day-11.txt').then(value => run(value.toString()));
}

export default { execute }