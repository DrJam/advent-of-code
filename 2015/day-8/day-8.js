import { debug } from 'node:console';
import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, newline } from '../../common/common.js';

function preProcess(rawinput) {
    let raw = []
    let actual = []
    rawinput.split(newline).forEach(line => {
        raw.push(line)
        actual.push(eval(line))
    });
    return [raw, actual]
}

function preProcessForPart1(input) {
    return input
}

function part1([raw, actual]) {
    return raw.reduce((p, c) => p + c.length, 0) - actual.reduce((p, c) => p + c.length, 0)
}

function preProcessForPart2(input) {
    return input
}

function escape(input) {
    input = input + ''
    input = input.replace(/[\\"]/g, '\\$&')
    input = input.replace(/[^a-zA-Z0-9\\\"]/g, (substring) => {
        let charCode = substring.charCodeAt(0).toString(16)
        let charCodeString = ('' + charCode).padStart(2, '0')
        return `\\x${charCodeString}`
    })
    return `"${input}"`
}

function part2([raw, actual]) {
    let unRaw = raw.map(r => escape(r))
    // console.log(unRaw.toString())
    return unRaw.reduce((p, c) => p + c.length, 0) - raw.reduce((p, c) => p + c.length, 0)

}

function run(input) {
    let t0 = performance.now()

    let preProcessedInput = preProcess(input)
    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    let readyForPart1 = preProcessForPart1(preProcessedInput)
    let result1 = part1(readyForPart1)
    let t2 = performance.now()
    console.log(`8a: ${~~(t2 - t1)}ms ${result1}`);

    let readyForPart2 = preProcessForPart2(preProcessedInput)
    let result2 = part2(readyForPart2)
    let t3 = performance.now()
    console.log(`8b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./2015/day-8/data-day-8.txt').then(value => run(value.toString()));
    // readFile('./2015/day-8/data-test-day-8.txt').then(value => run(value.toString()));
}

export default { execute }