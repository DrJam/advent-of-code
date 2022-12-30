import { readFile } from 'node:fs/promises';;

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

    console.log(`06a: ${getMatchIndex(chars, 4)}`);
    console.log(`06b: ${getMatchIndex(chars, 14)}`);
}

function execute() {
    readFile('./2022/day6/day6.txt').then(value => run(value.toString()));
}

export default { execute }