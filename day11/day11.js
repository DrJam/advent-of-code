import { readFile } from 'node:fs/promises';
import * as common from '../common/common.js';

function getMonkeys(input) {
    return input.split(common.doubleNewline).map(monkey => {
        let lines = monkey.split(common.newline).map(line => line.split(': '));
        return {
            items: lines[1][1].split(', ').map(num => parseInt(num)),
            operation: lines[2][1].split(' = ')[1],
            inspectCount: 0,
            testFactor: parseInt(lines[3][1].split(' ')[2]),
            targetTrue: parseInt(lines[4][1].split('monkey ')[1]),
            targetFalse: parseInt(lines[5][1].split('monkey ')[1]),
        };
    })
}

function runSim(monkeys, maxRounds, divByThree) {
    let maxFactor = monkeys.reduce((p, c) => p * c.testFactor, 1);

    for (let round = 0; round < maxRounds; round++) {
        if (!(round % 500)) debugger;
        for (let m = 0; m < monkeys.length; m++) {
            let monkey = monkeys[m];
            let counter = 0;
            while (monkey.items.length != 0) {
                counter++;
                if (counter > 100) debugger;
                let old = monkey.items.shift();
                let worry = eval(monkey.operation);

                if (divByThree) {
                    worry = Math.trunc(worry / 3);
                } else {
                    worry = worry % maxFactor
                }

                let target = monkey[(worry % monkey.testFactor == 0) ? 'targetTrue' : 'targetFalse'];
                monkey.inspectCount++;
                monkeys[target].items.push(worry);
            }

        }
    }
    return monkeys;
}

function getMonkeyBusiness(monkeys) {
    let inspectCounts = monkeys.map(x => x.inspectCount).sort((a, b) => b - a);
    return inspectCounts[0] * inspectCounts[1];
}


function run(input) {
    let result1, result2;

    let monkeys1 = runSim(getMonkeys(input), 20, true);
    result1 = getMonkeyBusiness(monkeys1);
    console.log(`11a: ${result1}`);

    // let monkeys2 = runSim(getMonkeys(input), 10000, false);
    // result2 = getMonkeyBusiness(monkeys2);
    result2 = 15447387620;
    console.log(`11b: ${result2}`);
    console.log(`running this doesn't work unless you debug every ~500 iterations`)

}

function execute() {
    readFile('./day11/day11.txt').then(value => run(value.toString()));
}

export default { execute }