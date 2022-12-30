import { readFile } from 'node:fs/promises'

const coord = (x, y) => `${x},${y}`

const heur = ([ax, ay], [ex, ey], map) =>
    Math.abs(ex - ax) //x diff to end
    + Math.abs(ey - ay) //y diff to end
    + 'z'.charCodeAt(0) - map[ax][ay].charCodeAt(0)

const dist = ([ax, ay], [bx, by], map) => {
    if ((map[ax][ay] == 'S' || map[ax][ay] == 'a' || map[ax][ay] == 'b') && (map[bx][by] == 'S' || map[bx][by] == 'a' || map[bx][by] == 'b')) return 1;
    if ((map[ax][ay] == 'y' || map[ax][ay] == 'z') && map[bx][by] == 'E') return 1;
    return map[bx][by].charCodeAt(0) - map[ax][ay].charCodeAt(0) <= 1 ? 1 : 10000000
}

function getLowest(list, valueGetter, map) {
    let lowest = list[0]
    list.forEach((item, i) => {
        if (valueGetter(item) < valueGetter(lowest)) lowest = item
    })
    return lowest
}

function build(from, [x, y]) {
    let total = []
    while (coord(x, y) in from) {
        [x, y] = from[coord(x, y)]
        total.push([x, y])
    }
    return total
}

function getNeighbours([x, y], map) {
    let maxX = map.length - 1
    let maxY = map[maxX].length - 1
    let neighbours = []
    if (x > 0) neighbours.push([x - 1, y])
    if (y > 0) neighbours.push([x, y - 1])
    if (x < maxX) neighbours.push([x + 1, y])
    if (y < maxY) neighbours.push([x, y + 1])
    return neighbours.filter(n => dist([x, y], n, map) == 1)
}

function astar(sx, sy, ex, ey, map) {
    let closed = []
    let open = [[sx, sy]]
    let from = {}

    let startCoord = (coord(sx, sy))
    let g = {}
    g[startCoord] = 0

    let f = {}
    f[startCoord] = g[startCoord] + heur([sx, sy], [ex, ey], map)

    while (open.length) {
        let current = getLowest(open, ([x, y]) => f[coord(x, y)], map)
        let currentCoord = coord(current[0], current[1])

        if (current[0] == ex && current[1] == ey) {
            return build(from, [ex, ey])
        }

        open.splice(open.indexOf(current), 1)
        closed.push(current)

        let neighbours = getNeighbours(current, map)
        neighbours.forEach(([nx, ny]) => {
            if (closed.some(([cx, cy]) => nx == cx && ny == cy)) {
                return
            }
            let tentativeG = g[currentCoord] + dist(current, [nx, ny], map)

            let neighbourCoord = coord(nx, ny)
            if (!open.some(([ox, oy]) => ox == nx && oy == ny) || tentativeG < g[neighbourCoord]) {
                from[neighbourCoord] = current
                g[neighbourCoord] = tentativeG
                f[neighbourCoord] = g[neighbourCoord] + heur([nx, ny], [ex, ey], map)
                if (!open.some(([ox, oy]) => ox == nx && oy == ny)) {
                    open.push([nx, ny])
                }
            }
        });
    }
    return []
}

function printOut(result, maxX, maxY) {
    for (let x = 0; x <= maxX; x++) {
        let line = `${x}: `
        for (let y = 0; y <= maxY; y++) {
            if (result.some(([rx, ry]) => x == rx && y == ry)) {
                line += '█';
            } else {
                line += '-';
            }
        }
        console.log(line)
    }
}

function run(input) {
    let result1, result2

    let sX, sY, ex, ey;
    let maxX, maxY
    let map = [];
    let lines = input.split('\r\n').map(x => x.split(''))
    let aPositions = [];

    lines.forEach((chars, x) => {
        map.push([]);
        chars.forEach((char, y) => {
            if (!maxX || x > maxX) maxX = x;
            if (!maxY || y > maxY) maxY = y;
            if (char == 'a') {
                aPositions.push([x, y]);
            }
            if (char == 'S') {
                sX = x
                sY = y
            }
            if (char == 'E') {
                ex = x
                ey = y
            }
            map[x].push(char);
        })
    })

    result1 = astar(sX, sY, ex, ey, map)
    console.log(`12a: ${result1.length} steps`)
    console.log('next part will take ~1-2 min to run')

    aPositions.forEach(([ax, ay], i) => {

        let result = astar(ax, ay, ex, ey, map)
        if (!result2 || (result.length > 0 && result.length < result2.length)) {
            result2 = result
        }
        if (i > 0 && i % 100 == 99) {
            console.log(`${i + 1}/${aPositions.length} searches done, current best: ${result2.length}`)
        }
    });
    printOut(result2, maxX, maxY);
    console.log(`12a: ${result2.length} steps`)
}

function execute() {
    readFile('./2022/day12/day12.txt').then(value => run(value.toString()))
}

export default { execute }