import { group } from 'node:console';
import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, newline } from '../../common/common.js';

function preProcess(rawinput) {
    return rawinput
}

function preProcessForPart1(input) {
    return input
}

function runNumberGame(data) {
    const groupMatch = new RegExp(/(\d)\1*/g)
    let matches = data.matchAll(groupMatch)
    let current = matches.next()
    let output = ''
    while (!current.done) {
        output += `${current.value[0].length}${current.value[1]}`
        current = matches.next()
    }
    return output
}

function part1(data) {
    let current = runNumberGame(data)
    for (let count = 1; count < 40; count++) {
        current = runNumberGame(current)
    }
    console.log(`${current.length}`)

}

function preProcessForPart2(input) {
    return input
}

function part2(data) {

    let current = runNumberGame(data)
    for (let count = 1; count < 50; count++) {
        current = runNumberGame(current)
    }
    console.log(`${current.length}`)
}

function run(input) {
    let t0 = performance.now()

    let preProcessedInput = preProcess(input)
    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    let readyForPart1 = preProcessForPart1(preProcessedInput)
    let result1 = part1(readyForPart1)
    let t2 = performance.now()
    console.log(`10a: ${~~(t2 - t1)}ms ${result1}`);

    let readyForPart2 = preProcessForPart2(preProcessedInput)
    let result2 = part2(readyForPart2)
    let t3 = performance.now()
    console.log(`10b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./2015/day-10/data-day-10.txt').then(value => run(value.toString()));
    // readFile('./2015/day-10/data-test-day-10.txt').then(value => run(value.toString()));
}

export default { execute }