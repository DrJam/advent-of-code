import { readFile } from 'node:fs/promises';
import * as common from '../../common/common.js'

const coord = ([x, y]) => `${x},${y}`

function getPaths(input) {
    let lines = input.split(common.newline)
    let paths = lines.map(line => line.split(' -> ').map(pair => pair.split(',').map(num => parseInt(num))))

    return paths
}

function getMap(paths) {
    const map = { maxY: 0, maxX: 500, minX: 500 }
    paths.forEach(path => {
        for (let i = 0; i < path.length - 1; i++) {
            let [sx, sy] = path[i] //start point of rock path
            let [ex, ey] = path[i + 1] //end
            let diffX = ex - sx //x distance to travel (can be negative)
            let diffY = ey - sy //same for y
            let xmod = diffX == 0 ? 0 : diffX / Math.abs(diffX) //+1 or -1 to indicate direction of travel
            let ymod = diffY == 0 ? 0 : diffY / Math.abs(diffY)
            let stopX = ex + xmod; //x or y value to stop iterating when reached, can be start
            let stopY = ey + ymod; //value if mod is 0, so loops aren't nested

            map.maxY = Math.max(map.maxY, sy, ey) //track highest y pos found
            map.maxX = Math.max(map.maxX, sx, ex)
            map.minX = Math.min(map.minX, sx, ex)

            for (let x = sx; x != stopX; x += xmod) { //iterate in x direction
                map[coord([x, sy])] = 'rock'
            }
            for (let y = sy; y != stopY; y += ymod) { //iterate in y direction
                map[coord([sx, y])] = 'rock'
            }
        }
    });
    return map
}

function dropSand(map, isFloor) {
    let [x, y] = [500, 0]
    let floorY = map.maxY + 2
    while (y < map.maxY + 10) {
        if (map[coord([x, y])]) {
            return;
        } else if (!map[coord([x, y + 1])] && (!isFloor || ((y + 1) < floorY))) {
            y++
        } else if (!map[coord([x - 1, y + 1])] && (!isFloor || ((y + 1) < floorY))) {
            x--
            y++
        } else if (!map[coord([x + 1, y + 1])] && (!isFloor || ((y + 1) < floorY))) {
            x++
            y++
        } else {
            map[coord([x, y])] = 'sand'
            x = 500
            y = 0
        }
    }
}

function getSandCount(map) {
    return Object.values(map).filter(x => x == 'sand').length;
}

function render(map) {
    for (let y = 0; y <= map.maxY + 10; y++) {
        let line = `${y}:`.padStart(4, '0');
        for (let x = map.minX; x <= map.maxX; x++) {
            if (map[coord([x, y])] == 'rock') {
                line += '█'
            } else if (map[coord([x, y])] == 'sand') {
                line += 'o'
            } else {
                line += ' '
            }
        }
        console.log(line)
    }
}

function run(input) {
    let paths = getPaths(input)
    let map1 = getMap(paths)
    let map2 = getMap(paths)

    let t0 = performance.now()
    dropSand(map1, false)
    let t1 = performance.now()
    dropSand(map2, true)
    let t2 = performance.now()


    // render(map1)
    // render(map2)

    console.log(`14a: ${~~(t1 - t0)}ms ${getSandCount(map1)}`);
    console.log(`14b: ${~~(t2 - t1)}ms ${getSandCount(map2)}`);
}

function execute() {
    readFile('./2022/day14/day14.txt').then(value => run(value.toString()));
}

export default { execute }