import { floor, pow } from 'mathjs';
import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, newline } from '../common/common.js';

function part2(data) {
}

function getNumbers(input) {
    let lines = input.split(newline).map(line => line.split(''))
    lines = lines.map(chars => chars.reverse())
    lines = lines.map(chars => chars.map((c, i) => {
        switch (c) {
            case '2': return 2 * pow(5, i)
            case '1': return 1 * pow(5, i)
            case '0': return 0 * pow(5, i)
            case '-': return -1 * pow(5, i)
            case '=': return -2 * pow(5, i)
        }
    }))
    return lines
}

function part1(numbers) {
    let sums = numbers.map(numList => numList.reduce((p, c) => p + c, 0));
    let fullSum = sums.reduce((p, c) => p + c, 0)

    let biggestPowerOfFive = 0
    while ((pow(5, biggestPowerOfFive) * 2) < fullSum) biggestPowerOfFive++

    let remaining = fullSum
    let number = []

    for (let i = biggestPowerOfFive; i >= 0; i--) {
        number.unshift(floor(remaining / pow(5, i)))
        remaining = remaining % pow(5, i)
    }

    for (let i = 0; i <= number.length - 1; i++) {
        if (number[i] > 2) {
            number[i] -= 5
            if (number[i + 1] !== null) {
                number[i + 1] += 1
            } else {
                number[i + 1] = 1
            }
        }
    }

    number.reverse()
    let output = ''
    number.forEach(digit => {
        switch (digit) {
            case 2: output += '2'; break;
            case 1: output += '1'; break;
            case 0: output += '0'; break;
            case -1: output += '-'; break;
            case -2: output += '='; break;
        }
    })
    return output
}

function run(input) {
    let t0 = performance.now()
    let result1, result2;

    let numbers = getNumbers(input)

    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    result1 = part1(numbers)
    let t2 = performance.now()
    console.log(`25a: ${~~(t2 - t1)}ms ${result1}`);

    result2 = part2()
    let t3 = performance.now()
    console.log(`25b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./day25/day25.txt').then(value => run(value.toString()));
    // readFile('./day25/day25.test.txt').then(value => run(value.toString()));
}

export default { execute }