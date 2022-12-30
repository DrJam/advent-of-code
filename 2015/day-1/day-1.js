import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, newline } from '../../common/common.js';


function preProcess(rawinput) {
    return rawinput
}

function preProcessForPart1(input) {
    return input
}

function part1(data) {
    let countU = (data.match(/\(/g) || []).length
    let countD = (data.match(/\)/g) || []).length
    return countU - countD
}

function preProcessForPart2(input) {
    return input
}

function part2(data) {
    let n = 0
    while (n <= data.length) {
        n++
        let floor = part1(data.substring(0, n))
        if (floor == -1)
            return n
    }
}

function run(input) {
    let t0 = performance.now()

    let preProcessedInput = preProcess(input)
    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    let readyForPart1 = preProcessForPart1(preProcessedInput)
    let result1 = part1(readyForPart1)
    let t2 = performance.now()
    console.log(`1a: ${~~(t2 - t1)}ms ${result1}`);

    let readyForPart2 = preProcessForPart2(preProcessedInput)
    let result2 = part2(readyForPart2)
    let t3 = performance.now()
    console.log(`1b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./2015/day-1/data-day-1.txt').then(value => run(value.toString()));
    // readFile('./2015/day-1/data-test-day-1.txt').then(value => run(value.toString()));
}

export default { execute }