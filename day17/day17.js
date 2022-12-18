import { floor, max, min } from 'mathjs';
import { info } from 'node:console';
import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { start } from 'node:repl';
import { coord, newline } from '../common/common.js';

const TOWER_WIDTH = 7
const ROCKS = [
    [[2, 0], [3, 0], [4, 0], [5, 0]],
    [[3, 0], [2, 1], [3, 1], [4, 1], [3, 2]],
    [[2, 0], [3, 0], [4, 0], [4, 1], [4, 2]],
    [[2, 0], [2, 1], [2, 2], [2, 3]],
    [[2, 0], [2, 1], [3, 0], [3, 1]],
]

function dropRocks(jets, tower, startRockIndex, jetIndex, totalRocks) {
    for (let rockIndex = startRockIndex; rockIndex < totalRocks; rockIndex++) {
        let rock = ROCKS[rockIndex % ROCKS.length]
        let yOff = max(tower.map(([x, y]) => y + 4))
        rock = rock.map(([x, y]) => [x, y + yOff])

        while (true) {
            let jet = jets[jetIndex % jets.length]
            let dx = 0
            if (jet == '<') {
                dx = -1
            } else {
                dx = 1
            }
            jetIndex++
            let newRock = rock.map(([x, y]) => [x + dx, y])
            if (newRock.some(([x, y]) => x < 0 || x >= TOWER_WIDTH)) {
                newRock = rock
            } else if (newRock.some(([rx, ry]) => tower.some(([tx, ty]) => rx == tx && ry == ty))) {
                newRock = rock
            }
            rock = newRock
            newRock = rock.map(([x, y]) => [x, y - 1])
            if (newRock.some(([rx, ry]) => tower.some(([tx, ty]) => rx == tx && ry == ty))) {
                rock.forEach(([rx, ry]) => tower.push([rx, ry]))
                break
            }
            rock = newRock
        }

    }
    return tower
}


function part1(jets) {
    let tower = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]]
    tower = dropRocks(jets, tower, 0, 0, 2022)
    return max(tower.map(([x, y]) => y))
}

function part2(jets) {
    let tower = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]]
    let jetIndex = 0
    const totalRocks = 1000000000000
    const towerHeights = {}
    for (let rockIndex = 0; rockIndex < totalRocks; rockIndex++) {
        let startKey = `${rockIndex % ROCKS.length}, ${jetIndex % jets.length}`

        let rock = ROCKS[rockIndex % ROCKS.length]
        let yOff = max(tower.map(([x, y]) => y + 4))
        rock = rock.map(([x, y]) => [x, y + yOff])

        let moveX = 0, moveY = 0

        while (true) {
            let jet = jets[jetIndex % jets.length]
            let dx = 0
            if (jet == '<') {
                dx = -1
            } else {
                dx = 1
            }
            jetIndex++
            let newRock = rock.map(([x, y]) => [x + dx, y])
            if (newRock.some(([x, y]) => x < 0 || x >= TOWER_WIDTH)) {
                newRock = rock
            } else if (newRock.some(([rx, ry]) => tower.some(([tx, ty]) => rx == tx && ry == ty))) {
                newRock = rock
            } else {
                moveX += dx
            }
            rock = newRock
            newRock = rock.map(([x, y]) => [x, y - 1])
            if (newRock.some(([rx, ry]) => tower.some(([tx, ty]) => rx == tx && ry == ty))) {
                rock.forEach(([rx, ry]) => tower.push([rx, ry]))

                let key = `${startKey}, ${moveX}, ${moveY}`
                let currentHeight = max(tower.map(([x, y]) => y))
                let infoForMove = towerHeights[key]
                if (!infoForMove) {
                    infoForMove = towerHeights[key] = []
                }

                let layout = []
                for (let x = 0; x < TOWER_WIDTH; x++) {
                    layout.push(max(tower.filter(([tx, y]) => tx == x).map(([tx, ty]) => ty - currentHeight)))
                }

                let stats = [currentHeight, rockIndex, layout]

                if (infoForMove.length) {
                    let prevPrev = infoForMove.length - 2
                    if (prevPrev < 0) prevPrev += infoForMove.length
                    let lastDiff = infoForMove[infoForMove.length - 1][0] - infoForMove[prevPrev][0]
                    let currDiff = currentHeight - infoForMove[infoForMove.length - 1][0]

                    let lastMoveDiff = infoForMove[infoForMove.length - 1][1] - infoForMove[prevPrev][1]
                    let currMoveDiff = rockIndex - infoForMove[infoForMove.length - 1][1]

                    let lastLayout = infoForMove[infoForMove.length - 1][2]

                    if (currDiff == lastDiff && lastMoveDiff == currMoveDiff) {
                        if (stats[2].toString() != lastLayout.toString())
                            throw 'uh oh!'

                        let remainingRocks = totalRocks - rockIndex - 1

                        let cycleLength = rockIndex - infoForMove[infoForMove.length - 1][1]
                        let cycles = floor(remainingRocks / cycleLength)
                        let totalJump = cycles * cycleLength

                        let jumpedTower = dropRocks(jets, tower, rockIndex + 1 + totalJump, jetIndex, totalRocks)
                        return max(jumpedTower.map(([x, y]) => y)) + currDiff * cycles
                    }
                }
                infoForMove.push(stats)
                break
            }
            moveY -= 1
            rock = newRock
        }
    }
    return max(tower.map(([x, y]) => y))
}

function run(input) {
    let t0 = performance.now()
    let result1, result2;
    const commands = input.split('')

    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    // result1 = part1(commands)
    let t2 = performance.now()
    console.log(`17a: ${~~(t2 - t1)}ms ${result1}`);

    result2 = part2(input)
    let t3 = performance.now()
    console.log(`17b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./day17/day17.txt').then(value => run(value.toString()));
    // readFile('./day17/day17test.txt').then(value => run(value.toString()));
}

export default { execute }