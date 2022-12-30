import { max } from 'mathjs';
import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, newline } from '../../common/common.js';

function preProcess(rawinput) {
    let lines = rawinput.split(newline)
    let output = []
    for (const line of lines) {
        let parts = line.split(' ')
        let start
        let action
        let end = parts[parts.length - 1].split(',').map((n => parseInt(n)))
        if (line.startsWith('toggle')) {
            action = 'toggle'
            start = parts[1].split(',').map(n => parseInt(n))
        } else if (line.startsWith('turn on')) {
            action = 'on'
            start = parts[2].split(',').map(n => parseInt(n))
        } else if (line.startsWith('turn off')) {
            action = 'off'
            start = parts[2].split(',').map(n => parseInt(n))
        }
        output.push([action, start, end])
    }
    return output
}

function preProcessForPart1(input) {
    return input
}

function part1(data) {
    let lights = []
    for (let i = 0; i < 1000; i++) {
        lights.push([])
        for (let j = 0; j < 1000; j++) {
            lights[i].push(false)
        }
    }
    for (const [action, [sx, sy], [ex, ey]] of data) {
        if (action == 'on') {
            for (let x = sx; x <= ex; x++) {
                for (let y = sy; y <= ey; y++) {
                    lights[x][y] = true
                }
            }
        } else if (action == 'off') {
            for (let x = sx; x <= ex; x++) {
                for (let y = sy; y <= ey; y++) {
                    lights[x][y] = false
                }
            }
        } else if (action == 'toggle') {
            for (let x = sx; x <= ex; x++) {
                for (let y = sy; y <= ey; y++) {
                    lights[x][y] = !lights[x][y]
                }
            }
        }
    }
    return lights.flat().filter(x => x).length
}

function preProcessForPart2(input) {
    return input

}

function part2(data) {
    let lights = []
    for (let i = 0; i < 1000; i++) {
        lights.push([])
        for (let j = 0; j < 1000; j++) {
            lights[i].push(0)
        }
    }
    for (const [action, [sx, sy], [ex, ey]] of data) {
        if (action == 'on') {
            for (let x = sx; x <= ex; x++) {
                for (let y = sy; y <= ey; y++) {
                    lights[x][y] += 1
                }
            }
        } else if (action == 'off') {
            for (let x = sx; x <= ex; x++) {
                for (let y = sy; y <= ey; y++) {
                    lights[x][y] -= 1
                    lights[x][y] = max(lights[x][y], 0)
                }
            }
        } else if (action == 'toggle') {
            for (let x = sx; x <= ex; x++) {
                for (let y = sy; y <= ey; y++) {
                    lights[x][y] += 2
                }
            }
        }
    }
    return lights.flat().reduce((p, c) => p + c, 0)

}

function run(input) {
    let t0 = performance.now()

    let preProcessedInput = preProcess(input)
    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    let readyForPart1 = preProcessForPart1(preProcessedInput)
    let result1 = part1(readyForPart1)
    let t2 = performance.now()
    console.log(`6a: ${~~(t2 - t1)}ms ${result1}`);

    let readyForPart2 = preProcessForPart2(preProcessedInput)
    let result2 = part2(readyForPart2)
    let t3 = performance.now()
    console.log(`6b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./2015/day-6/data-day-6.txt').then(value => run(value.toString()));
    // readFile('./2015/day-6/data-test-day-6.txt').then(value => run(value.toString()));
}

export default { execute }