import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { Equation, parse } from 'algebra.js';

function getMonkeys(input) {
    let lines = input.split('\r\n')
    let splitter = /(\w{4}): (\w{4}) (.) (\w{4})|(\w{4}): (\d+)/g
    let monkeys = {}
    lines.forEach(line => {
        let match = [...line.matchAll(splitter)][0]
        let id = match[1] || match[5];
        monkeys[id] = {
            a: match[2],
            op: match[3],
            b: match[4],
            value: match[6] === undefined ? undefined : parseInt(match[6]),
        }
    })
    return monkeys
}

function prepPart2(monkeys) {
    let rootA = monkeys.root.a
    let rootB = monkeys.root.b
    delete monkeys.root
    delete monkeys.humn
    return [monkeys, rootA, rootB]
}

function part1(monkeys) {
    let keys = Object.keys(monkeys)
    while (monkeys.root.value === undefined) {
        keys.forEach(key => {
            let monkey = monkeys[key]
            if (monkey.value !== undefined) return
            try {
                let a = monkeys[monkey.a].value
                let b = monkeys[monkey.b].value
                if (a === undefined || b === undefined) return
                monkey.value = eval(`${a} ${monkey.op} ${b}`)
            } catch (e) { }
        })
    }
    return monkeys.root.value
}

function part2(monkeys, rootA, rootB) {
    let keys = Object.keys(monkeys)
    while (monkeys[rootA].value === undefined && monkeys[rootB].value === undefined) {
        keys.forEach(key => {
            let monkey = monkeys[key]
            if (monkey.value !== undefined) return
            try {
                let a = monkeys[monkey.a].value
                let b = monkeys[monkey.b].value
                if (a === undefined || b === undefined) return
                monkey.value = eval(`${a} ${monkey.op} ${b}`)
            } catch (e) { }
        })
    }
    let toFind = monkeys[rootA].value === undefined ? rootA : rootB
    let found = monkeys[rootA].value === undefined ? rootB : rootA
    let toCheck = [monkeys[toFind].a, monkeys[toFind].b]
    let lhs = `${monkeys[toFind].a} ${monkeys[toFind].op} ${monkeys[toFind].b}`
    while (toCheck.length) {
        let check = toCheck.splice(0, 1)[0]
        let toReplace = new RegExp(check, "g");
        if (check == 'humn') {
            lhs = lhs.replace(toReplace, 'x')
        } else if (monkeys[check].value !== undefined) {
            lhs = lhs.replace(toReplace, monkeys[check].value)
        } else {
            lhs = lhs.replace(toReplace, `(${monkeys[check].a} ${monkeys[check].op} ${monkeys[check].b})`)
            toCheck.push(monkeys[check].a, monkeys[check].b)
        }
    }
    console.log(monkeys[found].value, '=', lhs)
    let exp = parse(lhs)
    let expr = new Equation(exp, monkeys[found].value)
    let result = expr.solveFor('x')

    return Math.floor(result.valueOf())
}

function run(input) {
    let t0 = performance.now()
    let result1, result2;
    let monkeys = getMonkeys(input)

    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    result1 = part1(monkeys)
    let t2 = performance.now()
    console.log(`21a: ${~~(t2 - t1)}ms ${result1}`);

    let [p2Monkeys, rootA, rootB] = prepPart2(getMonkeys(input))
    result2 = part2(p2Monkeys, rootA, rootB)
    let t3 = performance.now()
    console.log(`21b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./2022/day21/day21.txt').then(value => run(value.toString()));
    // readFile('./2022/day21/day21.test.txt').then(value => run(value.toString()));
}

export default { execute }