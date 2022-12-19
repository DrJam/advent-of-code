import { isNumber, max, min, sum } from 'mathjs';
import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, coord3, newline } from '../common/common.js';

function getNeighbours([x, y, z]) {
    return [
        [x + 1, y, z],
        [x - 1, y, z],
        [x, y + 1, z],
        [x, y - 1, z],
        [x, y, z + 1],
        [x, y, z - 1],
    ]
}

function part1(coords) {
    let isLava = {}
    let total = 0;
    coords.forEach(c => isLava[c] = true);
    coords.forEach(current => {
        let [x, y, z] = current
        let count = 6
        getNeighbours([x, y, z]).forEach(([nx, ny, nz]) => {
            if (isLava[coord3([nx, ny, nz])])
                count--
        });
        total += count
    })
    return total
}

function part2(coords) {
    let [minx, miny, minz, maxx, maxy, maxz] = [0, 0, 0, 0, 0, 0]
    coords.forEach(([x, y, z]) => {
        minx = min(minx, x)
        miny = min(miny, y)
        minz = min(minz, z)
        maxx = max(maxx, x)
        maxy = max(maxy, y)
        maxz = max(maxz, z)
    })
    minx--, miny--, minz--, maxx++, maxy++, maxz++
    let water = []
    let toCheck = [[minx, miny, minz]]
    while (toCheck.length) {
        let [cx, cy, cz] = toCheck.splice(0, 1)[0]

        if (water[coord3([cx, cy, cz])]) {
            continue
        }

        water[coord3([cx, cy, cz])] = true
        let neighbours = getNeighbours([cx, cy, cz])

        neighbours.forEach(([nx, ny, nz]) => {
            if (minx <= nx && nx <= maxx
                && miny <= ny && ny <= maxy
                && minz <= nz && nz <= maxz) {
                if (!coords.some(([x, y, z]) => nx == x & ny == y & nz == z)) {
                    toCheck.push([nx, ny, nz])
                }
            }
        });
    }

    let lavaOutside = []
    for (let x = minx; x <= maxx; x++) {
        for (let y = miny; y <= maxy; y++) {
            for (let z = minz; z <= maxz; z++) {
                if (!water[coord3([x, y, z])]) {
                    lavaOutside.push([x, y, z])
                }
            }
        }

    }
    return part1(lavaOutside)

}

function run(input) {
    let t0 = performance.now()
    let result1, result2;
    let coords = input.split(newline).map(line => line.split(',').map(num => parseInt(num)))

    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    result1 = part1(coords)
    let t2 = performance.now(coords)
    console.log(`18a: ${~~(t2 - t1)}ms ${result1}`);

    result2 = part2(coords)
    let t3 = performance.now()
    console.log(`18b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./day18/day18.txt').then(value => run(value.toString()));
    // readFile('./day18/day18test.txt').then(value => run(value.toString()));
}

export default { execute }