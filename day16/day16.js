import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, newline } from '../common/common.js';

function getNetwork(input) {
    let n = {}
    let lines = input.split(newline)
    lines.forEach(line => {
        let [firstHalf, secondHalf] = line.split('; ')
        let [label, rate] = firstHalf.split(' has flow rate=')
        label = label.split(' ')[1]
        rate = parseInt(rate);
        let [trash, neighbours] = secondHalf.split(' valves ')
        if (!neighbours) {
            [trash, neighbours] = secondHalf.split(' valve ')
        }
        neighbours = neighbours.split(', ').map(ref => ({
            ref: ref,
            cost: 1
        }))

        n[label] = {
            rate: rate,
            on: rate === 0,
            neighbours: neighbours
        }
    });
    return n
}

function fwpr(network, start) {
    let dist = {}
    let next = {}
    let checked = []
    let toCheck = [start]
    while (toCheck.length) {
        let c = toCheck.pop()
        dist[coord([c, c])] = 0
        next[coord([c, c])] = c
        network[c].neighbours.forEach(n => {
            dist[coord([c, n.ref])] = 1
            next[coord([c, n.ref])] = n.ref
            if (!checked.some(x => x == n.ref)) toCheck.push(n.ref)
        });
        checked.push(c)
    }
    let uniq = [...new Set(checked)]
    for (let k = 0; k < uniq.length; k++) {
        let kRef = uniq[k];
        for (let i = 0; i < uniq.length; i++) {
            let iRef = uniq[i];
            for (let j = 0; j < uniq.length; j++) {
                let jRef = uniq[j];
                let distIJ = dist[coord([iRef, jRef])] ? dist[coord([iRef, jRef])] : Number.MAX_VALUE
                let distIK = dist[coord([iRef, kRef])] ? dist[coord([iRef, kRef])] : Number.MAX_VALUE
                let distJK = dist[coord([kRef, jRef])] ? dist[coord([kRef, jRef])] : Number.MAX_VALUE
                if (distIJ > (distIK + distJK)) {
                    dist[coord([iRef, jRef])] = dist[coord([iRef, kRef])] + dist[coord([kRef, jRef])]
                    next[coord([iRef, jRef])] = next[coord([iRef, kRef])]
                }
            }
        }
    }
    return next
}

function path(next, u, v) {
    if (!next[coord([u, v])]) {
        return []
    }
    let p = []
    while (u != v) {
        u = next[coord([u, v])]
        p.push(u)
    }
    return p
}

function getValueNodes(network) {
    let result = ['AA']
    for (const key in network) {
        if (Object.hasOwnProperty.call(network, key)) {
            const node = network[key];
            if (node.rate) {
                result.push(key)
            }
        }
    }
    return result
}

function getSimplifiedNetwork(network, next, valueNodes) {
    let neighbours = [];
    let value = []
    for (let i = 0; i < valueNodes.length; i++) {
        let from = valueNodes[i]
        value[from] = network[from].rate
        neighbours[from] = []
        for (let j = 0; j < valueNodes.length; j++) {
            let to = valueNodes[j]
            let p = path(next, from, to)
            neighbours[from].push([to, p.length])
        }
    }
    return [neighbours, value]
}

function dfs(node, neighbours, value, visited, cost, quality, path, paths, maxCost) {
    if (cost > maxCost) {
        return;
    }

    if (!visited[node] && value[node]) {
        visited[node] = true
        cost += 1
        quality += value[node] * (maxCost - cost)
    }

    paths.push([path.sort(), quality])
    if (cost == maxCost) {
        return;
    }

    let toSearch = neighbours[node].filter(([nRef, nCost]) => !visited[nRef] && ((cost + nCost) < maxCost))

    toSearch.forEach(([nRef, nCost]) => {
        dfs(
            nRef,
            neighbours,
            value,
            { ...visited },
            cost + nCost,
            quality,
            [...path, nRef],
            paths,
            maxCost
        )
    })
    if (!toSearch.length && cost <= maxCost) {
        paths.push([path.sort(), quality])
    }
    return paths
}

function part1(paths) {
    paths.sort((a, b) => b[1] - a[1])
    return paths[0][1]
}

function part2(paths) {
    let pathsDown = [...paths]
    let best = 0

    pathsDown.forEach(([downPath, downQuality], i, list) => {
        if (i > 20000) {
            return;
        }
        let bestComplement = pathsDown.find(([compPath, compQuality]) => (
            (downQuality + compQuality > best)
            && !downPath.find(down => compPath.find(comp => down == comp))
        ))
        if (bestComplement) {
            let [bestPath, bestQuality] = bestComplement
            if (best < (downQuality + bestQuality)) {
                best = downQuality + bestQuality
            }
        }
    })

    return best
}

function run(input) {
    let t0 = performance.now()
    let result1, result2;
    let network = getNetwork(input)
    let next = fwpr(network, 'AA')
    let valueNodes = getValueNodes(network)
    let [neighbours, value] = getSimplifiedNetwork(network, next, valueNodes)

    let paths1 = dfs('AA', neighbours, value, { AA: true }, 0, 0, [], [], 30)
    let paths2 = dfs('AA', neighbours, value, { AA: true }, 4, 0, [], [], 30)
    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms to calculate ${paths1.length + paths2.length} paths`);

    result1 = part1(paths1)
    let t2 = performance.now()
    console.log(`16a: ${~~(t2 - t1)}ms ${result1}`);

    result2 = part2(paths2)
    let t3 = performance.now()
    console.log(`Checked 20,000 highest quality paths against all complements`)
    console.log(`16b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./day16/day16.txt').then(value => run(value.toString()));
    // readFile('./day16/day16test.txt').then(value => run(value.toString()));
}

export default { execute }