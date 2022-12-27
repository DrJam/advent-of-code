import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, newline } from '../common/common.js';

const move = {
    nw: [-1, -1],
    n: [0, -1],
    ne: [1, -1],
    e: [1, 0],
    se: [1, 1],
    s: [0, 1],
    sw: [-1, 1],
    w: [-1, 0],
}

const checkmap = {
    n: [move.nw, move.n, move.ne],
    e: [move.ne, move.e, move.se],
    s: [move.se, move.s, move.sw],
    w: [move.sw, move.w, move.nw]
}

const dir = {
    n: 'n',
    s: 's',
    w: 'w',
    e: 'e',
}

const X = 0
const Y = 1
const CHECKORDER = 2
const PROPOSAL = 3
const MOVED = 4

function getElves(input) {
    let lines = input.split(newline).map(line => line.split(''))
    let elves = []
    lines.forEach((line, y) => {
        line.forEach((tile, x) => {
            if (tile != '#') { return }
            elves.push([
                x, y,
                [dir.n, dir.s, dir.w, dir.e],
                null,
                false
            ])
        })
    })
    return elves
}

function rotateCheckOrder(elf) {
    elf[CHECKORDER].push(elf[CHECKORDER].splice(0, 1)[0])
}

function applyOrClearProposal(elf, proposal) {
    if (proposal) {
        elf[PROPOSAL] = proposal
    } else {
        elf[PROPOSAL] = null
    }
}

function getRelativePosition(elf, posMod) {
    return [elf[X] + posMod[X], elf[Y] + posMod[Y]]
}

function someElfAtAbsolutePosition(pos, elves) {
    return elves.some(otherElf => pos[X] == otherElf[X] && pos[Y] == otherElf[Y])
}

function someElfAtRelativePosition(posMod, elf, elves) {
    let checkPos = getRelativePosition(elf, posMod)
    return someElfAtAbsolutePosition(checkPos, elves)
}

function directionIsClear(check, elf, elves) {
    return !checkmap[check].find((posMod) => someElfAtRelativePosition(posMod, elf, elves))
}

function getProposal(elf, elves) {
    let clearDirections = elf[CHECKORDER].filter((check) => directionIsClear(check, elf, elves))
    if (!clearDirections) return null
    if (clearDirections.length == elf[CHECKORDER].length) return null
    return clearDirections[0]
}

function getProposals(elves) {
    return elves.filter(e => e[PROPOSAL] != null).map(e => {
        return getRelativePosition(e, move[e[PROPOSAL]])
    })
}

function getUniqProposals(proposals, elves) {
    return proposals.filter(p => {
        let matchingElves = elves.filter(e => {
            if (!e[PROPOSAL]) return false
            let elfProposedPos = getRelativePosition(e, move[e[PROPOSAL]])
            return elfProposedPos[X] == p[X] && elfProposedPos[Y] == p[Y]
        })
        return matchingElves.length == 1
    })
}

function clearNonUniqProposals(elves, uniqProposals) {
    elves.forEach(e => {
        if (!e[PROPOSAL]) return false
        let elfProposedPos = getRelativePosition(e, move[e[PROPOSAL]])
        if (!uniqProposals.some(([x, y]) => elfProposedPos[X] == x && elfProposedPos[Y] == y)) {
            e[PROPOSAL] = null
        }
    })
}

function applyMove(elf) {
    if (elf[PROPOSAL] == null) {
        return
    }
    let newPos = getRelativePosition(elf, move[elf[PROPOSAL]])
    elf[X] = newPos[X]
    elf[Y] = newPos[Y]
    elf[MOVED] = true
}

function getUnusedTilesInBoundingRect(elves) {
    let x = elves.map(e => e[X])
    let y = elves.map(e => e[Y])
    let minx = Math.min(...x), maxx = Math.max(...x)
    let miny = Math.min(...y), maxy = Math.max(...y)
    return ((maxx - minx + 1) * (maxy - miny + 1)) - elves.length
}

function part1(elves) {
    let counter = 0;
    while (counter < 10) {
        elves.forEach(elf => applyOrClearProposal(elf, getProposal(elf, elves)))

        let proposals = getProposals(elves)
        let uniqProposals = getUniqProposals(proposals, elves)
        clearNonUniqProposals(elves, uniqProposals)

        elves.forEach(elf => applyMove(elf))

        elves.forEach(elf => rotateCheckOrder(elf))

        counter++
    }
    return getUnusedTilesInBoundingRect(elves)
}

function part2(elves) {
    let counter = 0;
    let moved = true;
    while (moved) {
        elves.forEach(elf => (elf[MOVED] = false))
        elves.forEach(elf => applyOrClearProposal(elf, getProposal(elf, elves)))

        let proposals = getProposals(elves)
        let uniqProposals = getUniqProposals(proposals, elves)
        clearNonUniqProposals(elves, uniqProposals)

        elves.forEach(elf => applyMove(elf))

        elves.forEach(elf => rotateCheckOrder(elf))

        moved = elves.some(e => e[MOVED])
        counter++
    }
    return counter

}

function run(input) {
    let t0 = performance.now()
    let result1, result2;

    let elves1 = getElves(input)
    let elves2 = getElves(input)

    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    result1 = part1(elves1)
    let t2 = performance.now()
    console.log(`23a: ${~~(t2 - t1)}ms ${result1}`);

    result2 = part2(elves2)
    let t3 = performance.now()
    console.log(`23b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./day23/day23.txt').then(value => run(value.toString()));
    // readFile('./day23/day23.test.txt').then(value => run(value.toString()));
}

export default { execute }