import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, newline } from '../../common/common.js';

function preProcessForPart1(input) {
    return JSON.parse(input)
}

function processArray(item, ignore) {
    let sum = 0
    let values = item.map(x => processUnknownItem(x, ignore))
    return sum + values.reduce((p, c) => p + c, 0)
}

function processObject(item, ignore) {
    let sum = 0
    if (ignore) {
        let values = Object.values(item)
        if (values.some(x => x === ignore)) return sum
    }
    for (const key in item) {
        sum += processUnknownItem(item[key], ignore)
    }
    return sum
}

function processUnknownItem(item, ignore) {
    if (typeof item === 'string' || item instanceof String) return 0
    if (typeof item === 'number' && isFinite(item)) return item
    if (Array.isArray(item)) return processArray(item, ignore)
    return processObject(item, ignore)
}

function part1(data) {
    let sums = []
    for (const key in data) {
        sums.push(processUnknownItem(data[key]))
    }
    console.log(sums)
    return sums.reduce((p, c) => p + c, 0)
}

function preProcessForPart2(input) {
    return preProcessForPart1(input)
}

function part2(data) {
    let sums = []
    for (const key in data) {
        sums.push(processUnknownItem(data[key], 'red'))
    }
    console.log(sums)
    return sums.reduce((p, c) => p + c, 0)

}

function run(input) {
    let t0 = performance.now()

    let readyForPart1 = preProcessForPart1(input)
    let readyForPart2 = preProcessForPart2(input)

    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    let result1 = part1(readyForPart1)
    let t2 = performance.now()
    console.log(`12a: ${~~(t2 - t1)}ms ${result1}`);

    let result2 = part2(readyForPart2)
    let t3 = performance.now()
    console.log(`12b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./2015/day-12/data-day-12.txt').then(value => run(value.toString()));
    // readFile('./2015/day-12/data-test-day-12.txt').then(value => run(value.toString()));
}

export default { execute }