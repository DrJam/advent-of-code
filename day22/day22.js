import { isNumber } from 'mathjs';
import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, doubleNewline, newline } from '../common/common.js';

const DIR_VALUE = {
    R: 0, D: 1, L: 2, U: 3
}

const MOVE = {
    U: [0, -1],
    D: [0, 1],
    L: [-1, 0],
    R: [1, 0],
}

const TURN = {
    U: { L: 'L', R: 'R' },
    D: { L: 'R', R: 'L' },
    L: { L: 'D', R: 'U' },
    R: { L: 'U', R: 'D' }
}

const directionsClockwise = ['east', 'south', 'west', 'north'];
const cubeFacesClockwise = {
    u: ['r', 'f', 'l', 'b'],
    r: ['u', 'b', 'd', 'f'],
    f: ['u', 'r', 'd', 'l'],
};
cubeFacesClockwise.d = [...cubeFacesClockwise.u].reverse();
cubeFacesClockwise.l = [...cubeFacesClockwise.r].reverse();
cubeFacesClockwise.b = [...cubeFacesClockwise.f].reverse();

function getMapLine1(line) {
    let chars = line.split('')
    let mapLine = {
        walls: []
    }
    chars.forEach((char, i) => {
        if (mapLine.start === undefined && char !== ' ') {
            mapLine.start = i
            mapLine.end = chars.length - 1
        }
        if (char == '#') {
            mapLine.walls.push(i)
        }
    });
    return mapLine
}

function getCmds1(line) {
    let matcher = /((?:\d+)|[A-Z]+)/g
    let matches = [...line.matchAll(matcher)]
    let cmds = matches.map((match) => {
        let val = parseInt(match[0])
        if (isNaN(val)) {
            return match[0]
        } else {
            return val
        }
    })
    return cmds
}

function preProcess1(input) {
    let lines = input.split(newline)
    let map = []
    let cmds = []
    let mapDone = false
    lines.forEach((line, i) => {
        if (!line) {
            mapDone = true
            return
        }
        if (mapDone) {
            cmds = getCmds1(line)
        } else {
            map.push(getMapLine1(line))
        }
    });
    return [map, cmds]
}

function step1(pos, dir, map) {
    pos = pos.map((v, i) => v + MOVE[dir][i])
    pos[1] = (pos[1] + map.length) % map.length
    if (pos[0] > map[pos[1]].end && dir == 'R') {
        pos[0] = map[pos[1]].start
    }
    if (pos[0] < map[pos[1]].start && dir == 'L') {
        pos[0] = map[pos[1]].end
    }
    if (xNotOnLine1(pos[0], map[pos[1]])) {
        pos = step1(pos, dir, map)
    }
    return pos
}

function xNotOnLine1(x, line) {
    return line.start > x || line.end < x
}

function doMove1(dir, pos, cmd, map) {
    let [x, y] = pos
    let [newX, newY] = [x, y]
    for (let count = 0; count < cmd; count++) {
        [newX, newY] = step1([x, y], dir, map)
        if (map[newY].walls.some(wallX => wallX == newX)) {
            break
        }
        [x, y] = [newX, newY]
    }
    return [x, y]
}

function part1(map, cmds) {
    let dir = 'R'
    let pos = [map[0].start, 0]
    cmds.forEach(cmd => {
        let isTurn = !isNumber(cmd)
        if (isTurn) {
            dir = TURN[dir][cmd]
        } else {
            pos = doMove1(dir, pos, cmd, map)
        }

    });
    let col = pos[0] + 1
    let row = pos[1] + 1
    let dirVal = DIR_VALUE[dir]
    return (row * 1000) + (col * 4) + dirVal
}

function preProcess2(input) {
    let parts = input.split(doubleNewline)
    let cmds = getCmds1(parts[1])
    let map = parts[0].split(newline)
    let size = Math.sqrt(map.join('').split('').filter(char => char != ' ').length / 6)
    let faces = []
    let facemap = []
    let n = 0
    for (let i = 0; i < map.length / size; ++i) {
        facemap[i] = []
        for (let j = 0; j < Math.max(...map.map(line => line.length)) / size; ++j) {
            const c = map[i * size][j * size]
            if (c != null && c !== ' ') {
                facemap[i][j] = n
                faces[n] = { i, j, map: map.slice(i * size, (i + 1) * size).map(line => line.slice(j * size, (j + 1) * size).split('')) }
                ++n;
            } else {
                facemap[i][j] = null
            }
        }

    }

    return { faces, facemap, size, cmds }
}

function populateNeighbours2(face, direction, neighbour) {
    const dirIdx = directionsClockwise.indexOf(direction)
    const faceIdx = cubeFacesClockwise[face.face].indexOf(neighbour)

    for (let i = 0; i < 4; ++i) {
        const d = directionsClockwise[(dirIdx + i) % 4];
        const s = cubeFacesClockwise[face.face][(faceIdx + i) % 4];
        face[d] = s;
    }


}

function calculateFaceConnections2(faces, faceMap) {
    faces[0].face = 'u'

    populateNeighbours2(faces[0], 'east', 'r')

    const closed = new Set();
    (function walk(n) {
        closed.add(n);

        const { i, j } = faces[n];
        const neighbors = {
            east: faceMap[i][j + 1],
            south: faceMap[i + 1] && faceMap[i + 1][j],
            west: faceMap[i][j - 1],
            north: faceMap[i - 1] && faceMap[i - 1][j],
        };

        if (neighbors.east && !closed.has(neighbors.east)) {
            faces[neighbors.east].face = faces[n].east;
            populateNeighbours2(faces[neighbors.east], 'west', faces[n].face);
            walk(neighbors.east);
        }
        if (neighbors.south && !closed.has(neighbors.south)) {
            faces[neighbors.south].face = faces[n].south;
            populateNeighbours2(faces[neighbors.south], 'north', faces[n].face);
            walk(neighbors.south);
        }
        if (neighbors.west && !closed.has(neighbors.west)) {
            faces[neighbors.west].face = faces[n].west;
            populateNeighbours2(faces[neighbors.west], 'east', faces[n].face);
            walk(neighbors.west);
        }
        if (neighbors.north && !closed.has(neighbors.north)) {
            faces[neighbors.north].face = faces[n].north;
            populateNeighbours2(faces[neighbors.north], 'south', faces[n].face);
            walk(neighbors.north);
        }
    })(0);
}

function part2(info) {
    let { faces, facemap, size, cmds } = info

    calculateFaceConnections2(faces, facemap)
    let f = 0;
    let x = 0;
    let y = 0;
    let dir = 'east';

    for (let cmd of cmds) {
        if (cmd === 'L') {
            dir = directionsClockwise[(directionsClockwise.indexOf(dir) + 3) % 4];
        } else if (cmd === 'R') {
            dir = directionsClockwise[(directionsClockwise.indexOf(dir) + 1) % 4];
        } else {
            for (let i = 0; i < cmd; ++i) {
                const [dx, dy] = {
                    east: [1, 0],
                    south: [0, 1],
                    west: [-1, 0],
                    north: [0, -1],
                }[dir];

                let newX = x + dx;
                let newY = y + dy;
                let newF = f;
                let newDir = dir;

                if (newX < 0 || newX >= size || newY < 0 || newY >= size) {
                    newX = (newX + size) % size;
                    newY = (newY + size) % size;
                    newF = faces.findIndex(({ face }) => face === faces[f][dir]);

                    const dirIdx = directionsClockwise.indexOf(dir);

                    let newDirIdx = dirIdx;
                    while (faces[newF][directionsClockwise[(newDirIdx + 2) % 4]] !== faces[f].face) {
                        [newX, newY] = [size - 1 - newY, newX];
                        newDirIdx = (newDirIdx + 1) % 4;
                    }
                    newDir = directionsClockwise[newDirIdx];
                }

                if (faces[newF].map[newY][newX] === '#') {
                    break;
                }

                x = newX;
                y = newY;
                f = newF;
                dir = newDir;
            }
        }
    }

    const i = faces[f].i * size + y + 1
    const j = faces[f].j * size + x + 1;
    return 1000 * i + 4 * j + { east: 0, south: 1, west: 2, north: 3 }[dir];
}

function run(input) {
    let t0 = performance.now()
    let result1, result2;

    let [map1, cmds1] = preProcess1(input)
    let info2 = preProcess2(input)
    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    result1 = part1(map1, cmds1)
    let t2 = performance.now()
    console.log(`22a: ${~~(t2 - t1)}ms ${result1}`);

    result2 = part2(info2)
    let t3 = performance.now()
    console.log(`22b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./day22/day22.txt').then(value => run(value.toString()));
    // readFile('./day22/day22.test.txt').then(value => run(value.toString()));
}

export default { execute }