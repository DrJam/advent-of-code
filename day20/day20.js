import { readFile } from 'node:fs/promises';
import { newline } from '../common/common.js';

function getNums(input) {
    return input.split(newline).map(x => parseInt(x))
}

function mix(nums, count) {
    nums = nums.map(x => ({ val: x }))
    let originalOrder = [...nums]

    for (let mixCount = 0; mixCount < count; mixCount++) {
        originalOrder.forEach((num) => {
            let index = nums.indexOf(num)
            if (!~index) throw 'cant find it m8'

            nums.splice(index, 1)

            let target = index + num.val
            if (target < 0) target += nums.length * Math.abs(Math.floor(target / nums.length))
            if (target >= nums.length) target = target % nums.length

            nums.splice(target, 0, num)
        });
    }
    return nums.map(x => x.val)
}

function getResult(mixed) {
    let indexOfZero = mixed.indexOf(0)
    return [
        mixed[(1000 + indexOfZero) % mixed.length],
        mixed[(2000 + indexOfZero) % mixed.length],
        mixed[(3000 + indexOfZero) % mixed.length]
    ].reduce((p, c) => p + c, 0)
}

function part2(nums) {
    nums = nums.map(x => x * 811589153)
    let mixed = mix(nums, 10)
    return getResult(mixed);
}

function part1(nums) {
    let mixed = mix(nums, 1)
    return getResult(mixed);
}

function run(input) {
    let result1, result2;
    let nums = getNums(input)
    result1 = part1([...nums])
    result2 = part2([...nums])
    console.log(result1, result2)
}

function execute() {
    readFile('./day20/day20.txt').then(value => run(value.toString()));
    // readFile('./day20/day20.test.txt').then(value => run(value.toString()));
}

export default { execute }