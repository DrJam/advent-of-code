import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, newline } from '../../common/common.js';

function preProcess(rawinput) {

}

function preProcessForPart1(input) {

}

function part1(data) {

}

function preProcessForPart2(input) {

}

function part2(data) {

}

function run(input) {
    let t0 = performance.now()

    let preProcessedInput = preProcess(input)
    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    let readyForPart1 = preProcessForPart1(preProcessedInput)
    let result1 = part1(readyForPart1)
    let t2 = performance.now()
    console.log(`00a: ${~~(t2 - t1)}ms ${result1}`);

    let readyForPart2 = preProcessForPart2(preProcessedInput)
    let result2 = part2(readyForPart2)
    let t3 = performance.now()
    console.log(`00b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    // readFile('./2015/day-00/data-day-00.txt').then(value => run(value.toString()));
    readFile('./2015/day-00/data-test-day-00.txt').then(value => run(value.toString()));
}

export default { execute }