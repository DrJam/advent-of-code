import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, newline } from '../../common/common.js';

function preProcess(rawinput) {
    return rawinput.split('')
}

function preProcessForPart1(input) {
    return input
}

function part1(data) {
    let [x, y] = [0, 0]
    let houses = {}
    let i = 0

    houses[`${x},${y}`] = 1
    while (i < data.length) {
        switch (data[i]) {
            case '^': y += 1; break;
            case 'v': y -= 1; break;
            case '>': x += 1; break;
            case '<': x -= 1; break;
        }
        if (houses[`${x},${y}`] == null) {
            houses[`${x},${y}`] = 1
        } else {
            houses[`${x},${y}`] += 1
        }

        i++;
    }
    return Object.keys(houses).length
}

function preProcessForPart2(input) {
    return input
}

function part2(data) {
    let [sx, sy] = [0, 0]
    let [rx, ry] = [0, 0]
    let shouses = {}
    let rhouses = {}
    let i = 0

    shouses[`${sx},${sy}`] = 1
    while (i + 1 < data.length) {
        switch (data[i]) {
            case '^': sy += 1; break;
            case 'v': sy -= 1; break;
            case '>': sx += 1; break;
            case '<': sx -= 1; break;
        }
        if (shouses[`${sx},${sy}`] == null) {
            shouses[`${sx},${sy}`] = 1
        } else {
            shouses[`${sx},${sy}`] += 1
        }
        switch (data[i + 1]) {
            case '^': ry += 1; break;
            case 'v': ry -= 1; break;
            case '>': rx += 1; break;
            case '<': rx -= 1; break;
        }
        if (rhouses[`${rx},${ry}`] == null) {
            rhouses[`${rx},${ry}`] = 1
        } else {
            rhouses[`${rx},${ry}`] += 1
        }

        i++;
        i++;
    }
    let set = new Set([...Object.keys(shouses), ...Object.keys(rhouses)])
    let uniq = [...set]
    return uniq.length
}

function run(input) {
    let t0 = performance.now()

    let preProcessedInput = preProcess(input)
    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    let readyForPart1 = preProcessForPart1(preProcessedInput)
    let result1 = part1(readyForPart1)
    let t2 = performance.now()
    console.log(`3a: ${~~(t2 - t1)}ms ${result1}`);

    let readyForPart2 = preProcessForPart2(preProcessedInput)
    let result2 = part2(readyForPart2)
    let t3 = performance.now()
    console.log(`3b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./2015/day-3/data-day-3.txt').then(value => run(value.toString()));
    // readFile('./2015/day-3/data-test-day-3.txt').then(value => run(value.toString()));
}

export default { execute }