import { min } from 'mathjs';
import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, newline } from '../../common/common.js';

function preProcess(rawinput) {
    let boxes = rawinput
        .split(newline)
        .map(line => line
            .split('x')
            .map(num =>
                parseInt(num)
            )
        )
    return boxes
}

function preProcessForPart1(input) {
    return input.map(box => ([
        box[0] * box[1],
        box[1] * box[2],
        box[2] * box[0]
    ]))
}

function part1(data) {
    let paperReqs = []
    for (const box of data) {
        paperReqs.push(
            [
                box[0],
                box[0],
                box[1],
                box[1],
                box[2],
                box[2],
                min(box)
            ].reduce((p, c) => p + c, 0)
        )
    }
    return paperReqs.reduce((p, c) => p + c, 0)
}

function preProcessForPart2(input) {
    return input
}

function part2(data) {
    let ribbonReqs = []
    for (const edges of data) {
        edges.sort((a, b) => a - b)

        let twoShort = edges.slice(0, 2)
        let shortestCircumference = (twoShort[0] + twoShort[1]) * 2

        let volume = edges.reduce((p, c) => p * c, 1)

        ribbonReqs.push(shortestCircumference + volume)
    }
    return ribbonReqs.reduce((p, c) => p + c, 0)
}

function run(input) {
    let t0 = performance.now()

    let preProcessedInput = preProcess(input)
    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    let readyForPart1 = preProcessForPart1(preProcessedInput)
    let result1 = part1(readyForPart1)
    let t2 = performance.now()
    console.log(`2a: ${~~(t2 - t1)}ms ${result1}`);

    let readyForPart2 = preProcessForPart2(preProcessedInput)
    let result2 = part2(readyForPart2)
    let t3 = performance.now()
    console.log(`2b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./2015/day-2/data-day-2.txt').then(value => run(value.toString()));
    // readFile('./2015/day-2/data-test-day-2.txt').then(value => run(value.toString()));
}

export default { execute }