import { readFile } from 'node:fs/promises';
import * as common from '../../common/common.js';

function getDigits(lines) {
    return lines.map(x => common.getCharacters(x).map(y => parseInt(y)).filter(x => !isNaN(x)));
}

function getAllNumbers(lines) {
    let valueMap = {
        'one': 1,
        'two': 2,
        'three': 3,
        'four': 4,
        'five': 5,
        'six': 6,
        'seven': 7,
        'eight': 8,
        'nine': 9,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9
    }
    let numberStringRegex = new RegExp(`(${Object.keys(valueMap).join('|')})`, 'g')
    return lines.map(line => {
        let match = line.match(numberStringRegex);
        return match.map(x => valueMap[x]);
    });
}
function combineFirstAndLast(numbers) {
    return numbers.map(x => parseInt(`${x[0]}${x[x.length - 1]}`))
}

function run(input) {
    let lines = common.getLines(input);
    let numbers1 = getDigits(lines);
    let numbers2 = getAllNumbers(lines);

    let combined1 = numbers1.map(x => parseInt(`${x[0]}${x[x.length - 1]}`))
    let combined2 = numbers2.map(x => parseInt(`${x[0]}${x[x.length - 1]}`))
    let sum1 = combined1.reduce((a, b) => a + b, 0);
    let sum2 = combined2.reduce((a, b) => a + b, 0);
    console.log(sum1)
    console.log(sum2)
}

function execute() {
    readFile('./2023/day1/day1.txt').then(value => run(value.toString()));
}

export default { execute }