import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, newline } from '../../common/common.js';

function preProcess(rawinput) {
    let lines = rawinput.split(newline).map(line => line.split(' -> '))
    let commands = []
    for (const [lhs, rhs] of lines) {
        let lhsParts = lhs.split(' ')
        if (lhsParts.length == 1) {
            let in1 = parseInt(lhs)
            commands.push({
                in1: isNaN(in1) ? lhs : in1,
                op: 'ASSIGN',
                in2: null,
                out: rhs,
            })
        } else if (lhsParts.length == 2) {
            let in1 = parseInt(lhsParts[1])
            commands.push({
                in1: isNaN(in1) ? lhsParts[1] : in1,
                op: lhsParts[0],
                in2: null,
                out: rhs,
            })
        } else {
            let in1 = parseInt(lhsParts[0])
            let in2 = parseInt(lhsParts[2])
            commands.push({
                in1: isNaN(in1) ? lhsParts[0] : in1,
                op: lhsParts[1],
                in2: isNaN(in2) ? lhsParts[2] : in2,
                out: rhs,
            })
        }
    }
    return commands
}

function preProcessForPart1(input) {
    return input
}

function runCommands(mem, commands) {
    const value = (input) =>
        input === null
            ? undefined
            : isNaN(input)
                ? mem[input]
                : input

    while (Object.keys(mem).length < commands.length) {
        for (const { in1, op, in2, out } of commands) {
            if (mem[out] !== undefined) continue

            let in1value = value(in1)
            let in2value = value(in2)

            if (op == 'ASSIGN') {
                if (in1value !== undefined)
                    mem[out] = (in1value) & 0xFFFF
            } else if (op == 'NOT') {
                if (in1value !== undefined)
                    mem[out] = (~in1value) & 0xFFFF
            } else if (op == 'OR') {
                if (in1value !== undefined && in2value !== undefined)
                    mem[out] = (in1value | in2value) & 0xFFFF
            } else if (op == 'AND') {
                if (in1value !== undefined && in2value !== undefined)
                    mem[out] = (in1value & in2value) & 0xFFFF
            } else if (op == 'LSHIFT') {
                if (in1value !== undefined && in2value !== undefined)
                    mem[out] = (in1value << in2value) & 0xFFFF
            } else if (op == 'RSHIFT') {
                if (in1value !== undefined && in2value !== undefined)
                    mem[out] = (in1value >> in2value) & 0xFFFF
            }
        }
    }
    return mem
}

function part1(data) {
    let mem = {}
    runCommands(mem, data)
    return mem.a
}

function preProcessForPart2(input) {
    return input
}

function part2(data) {
    let mem = {}
    runCommands(mem, data)
    mem = { b: mem.a }
    runCommands(mem, data)
    return mem.a
}

function run(input) {
    let t0 = performance.now()

    let preProcessedInput = preProcess(input)
    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    let readyForPart1 = preProcessForPart1(preProcessedInput)
    let result1 = part1(readyForPart1)
    let t2 = performance.now()
    console.log(`7a: ${~~(t2 - t1)}ms ${result1}`);

    let readyForPart2 = preProcessForPart2(preProcessedInput)
    let result2 = part2(readyForPart2)
    let t3 = performance.now()
    console.log(`7b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./2015/day-7/data-day-7.txt').then(value => run(value.toString()));
    // readFile('./2015/day-7/data-test-day-7.txt').then(value => run(value.toString()));
}

export default { execute }