import { readFile } from 'node:fs/promises';;

function run(input) {
    let result1, result2;


    console.log(`xxa: ${result1}`);
    console.log(`xxb: ${result2}`);
}

function execute() {
    readFile('./dayX/dayX.txt').then(value => run(value.toString()));
}

export default { execute }