import { abs, ceil, floor, max } from 'mathjs';
import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, newline } from '../common/common.js';

const X = 0
const Y = 1

function getMaze(input) {
    let lines = input.split(newline).map(line => line.split(''))
    //first (only) . on first row
    let start = [lines[0].indexOf('.') - 1, -1]
    //first (only) . on final row
    let goal = [lines[lines.length - 1].indexOf('.') - 1, lines.length - 2]
    let storms = []
    let walls = new Set()
    let maxx = 0, maxy = 0
    lines.forEach((l, y) => {
        l.forEach((c, x) => {
            if (c == '<') storms.push([x - 1, y - 1, -1, 0])
            if (c == '>') storms.push([x - 1, y - 1, +1, 0])
            if (c == '^') storms.push([x - 1, y - 1, 0, -1])
            if (c == 'v') storms.push([x - 1, y - 1, 0, +1])
            if (c == '#') {
                walls.add(`${x - 1},${y - 1}`)
                maxx = max(maxx, x - 1)
                maxy = max(maxy, y - 1)
            }
        });
    });
    //wall blocking exiting maze by start or goal pos
    walls.add(`${start[X]},${start[Y] - 1}`)
    walls.add(`${goal[X]},${goal[Y] + 1}`)

    return [start, goal, storms, walls, maxx, maxy]
}

function search(start, goals, stormsStart, walls, maxx, maxy) {
    //at time 0, all possible positions is only start pos
    let time = 0
    let queue = [start]

    //list of movements, including holding still
    let walkableDirections = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [0, 0]
    ]

    //current goal
    let [gx, gy] = goals[0]
    let gxgy = `${gx},${gy}`
    while (goals.length) {
        time += 1

        //calculate storm positions, wrap
        let nowStorms = new Set(stormsStart.map(([x, y, dx, dy]) =>
            `${(x + (maxx * ceil(time / maxx)) + time * dx) % maxx},${(y + (maxy * ceil(time / maxy)) + time * dy) % maxy}`
        ))

        //get all neighbours of all current search positions
        let neighbours = []
        queue.forEach(([qx, qy]) => {
            walkableDirections.forEach(([dx, dy]) => {
                neighbours.push([qx + dx, qy + dy])
            })
        })

        //new search positions <= neighbours that aren't walls or storms
        queue = neighbours.filter((n) => {
            let nString = `${n[X]},${n[Y]}`
            return !walls.has(nString) && !nowStorms.has(nString)
        })

        //uniq search positions to keep queue short
        queue = queue.map(([qx, qy]) => `${qx},${qy}`)
        let queueSet = new Set(queue)
        queue = [...queueSet]
        queue = queue.map(qStr => qStr.split(',').map(qNum => parseInt(qNum)))

        //sort search positions by distance to goal ASC
        queue = queue.sort(([qax, qay], [qbx, qby]) => {
            let ma = abs((gx - qax)) + abs((gy - qay))
            let mb = abs((gx - qbx)) + abs((gy - qby))
            return ma - mb
        })

        //take top 100 value positions
        queue = queue.slice(0, 100)

        //if goal in possible positions
        if (queueSet.has(gxgy)) {
            console.log(`found goal after ${time} minutes, queue size ${queue.length}`)
            queue = [goals[0]]
            goals.shift()
            if (goals.length) {
                [gx, gy] = goals[0]
                gxgy = `${gx},${gy}`
            }
        }

        //shouldn't get here if solveable unless very big maze
        if (time > 2500) break
    }
    return time
}

function run(input) {
    let t0 = performance.now()
    let result1, result2;

    let [start, goal, storms, walls, maxx, maxy] = getMaze(input)

    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    result1 = search(start, [goal], storms, walls, maxx, maxy)
    let t2 = performance.now()
    console.log(`24a: ${~~(t2 - t1)}ms ${result1}`);

    result2 = search(start, [goal, start, goal], storms, walls, maxx, maxy)
    let t3 = performance.now()
    console.log(`24b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./day24/day24.txt').then(value => run(value.toString()));
    // readFile('./day24/day24.test.txt').then(value => run(value.toString()));
}

export default { execute }