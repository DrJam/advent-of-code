import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, newline } from '../../common/common.js';

function preProcess(rawinput) {
    return rawinput.split(newline)
}

function preProcessForPart1(input) {
    return input
}

function part1(data) {
    const nice1 = /(?:[aeiou].*?){3}/
    const nice2 = /([a-z])\1/
    const naughty1 = /(?:ab)|(?:cd)|(?:pq)|(?:xy)/
    let nice = data.filter((str, i) => {
        let rnice1 = nice1.test(str)
        let rnice2 = nice2.test(str)
        let rnaughty1 = naughty1.test(str)
        return rnice1 && rnice2 && !rnaughty1
    })
    return nice.length
}

function preProcessForPart2(input) {
    return input
}

function part2(data) {
    const nice1 = /([a-z][a-z]).*?\1/
    const nice2 = /([a-z]).\1/

    let nice = data.filter((str, i) => {
        let rnice1 = nice1.test(str)
        let rnice2 = nice2.test(str)
        return rnice1 && rnice2
    })
    return nice.length
}

function run(input) {
    let t0 = performance.now()

    let preProcessedInput = preProcess(input)
    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    let readyForPart1 = preProcessForPart1(preProcessedInput)
    let result1 = part1(readyForPart1)
    let t2 = performance.now()
    console.log(`5a: ${~~(t2 - t1)}ms ${result1}`);

    let readyForPart2 = preProcessForPart2(preProcessedInput)
    let result2 = part2(readyForPart2)
    let t3 = performance.now()
    console.log(`5b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./2015/day-5/data-day-5.txt').then(value => run(value.toString()));
    // readFile('./2015/day-5/data-test-day-5.txt').then(value => run(value.toString()));
}

export default { execute }