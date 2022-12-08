import * as fs from 'fs';

function getMatchIndex(chars, targetSize) {
    for (let i = targetSize; i < chars.length; i++) {
        let checkSet = chars.slice(i - targetSize, i);
        let match = checkSet.some((x, i) => checkSet.some((y, j) => x == y && i != j))
        if (!match) {
            return i;
        }
    }
}

function run(input) {
    let chars = input.split('');

    console.log(`06a: ${getMatchIndex(chars, 4)}`)
    console.log(`06b: ${getMatchIndex(chars, 14)}`)
}

function execute() {
    fs.readFile('./day 6/day-6.txt', 'utf8', (err, value) => run(value))
}

export { execute }