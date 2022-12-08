import * as fs from 'fs';

function run(input) {
    let result1, result2;


    console.log(`09a: ${result1}`)
    console.log(`09b: ${result2}`)
}

function execute() {
    fs.readFile('./day 9/day-9.txt', 'utf8', (err, value) => run(value))
}

export { execute }