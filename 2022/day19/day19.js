import { max, min } from 'mathjs';
import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { coord, newline } from '../../common/common.js';

function getSchema(input) {
    let numberFind = /(\d+)/g
    let lines = input.split(newline)
    return lines.map(line => {
        let result = line.match(numberFind).map(x => parseInt(x))
        let schema = {
            id: result[0],
            ore: { ore: result[1] },
            cla: { ore: result[2] },
            obs: { ore: result[3], cla: result[4] },
            geo: { ore: result[5], obs: result[6] },
            max: {
                ore: max(result[1], result[2], result[3], result[5]),
                cla: result[4],
                obs: result[6]
            }
        }
        return schema
    });
}



function search(oreCostOre, claCostOre, obsCostOre, obsCostCla, geoCostOre, geoCostObs, maxTime) {
    let best = 0

    let maxOreCost = max(oreCostOre, claCostOre, obsCostOre, geoCostOre)
    let queue = [[0, 0, 0, 0, 1, 0, 0, 0, maxTime]]
    let seen = {}
    let seenCount = 0;

    while (queue.length) {
        queue.sort((a, b) => a[8] - b[8])
        let [ore, cla, obs, geo, rOre, rCla, rObs, rGeo, timeLeft] = queue.splice(0, 1)[0]
        best = (geo > best) ? geo : best

        if (timeLeft == 0) continue

        if (rOre >= maxOreCost) rOre = maxOreCost

        if (rCla >= obsCostCla) rCla = obsCostCla

        if (rObs >= geoCostObs) rObs = geoCostObs

        let maxOreNeeded = (timeLeft * maxOreCost) - (rOre * (timeLeft - 1))
        if (ore >= maxOreNeeded) ore = maxOreNeeded

        let maxClaNeeded = (timeLeft * obsCostCla) - (rCla * (timeLeft - 1))
        if (cla >= maxClaNeeded) cla = maxClaNeeded

        let maxObsNeeded = (timeLeft * geoCostObs) - (rObs * (timeLeft - 1))
        if (obs >= maxObsNeeded) obs = maxClaNeeded

        let stateString = `${ore}, ${cla}, ${obs}, ${geo}, ${rOre}, ${rCla}, ${rObs}, ${rGeo}, ${timeLeft}`
        if (seen[stateString]) continue
        seen[stateString] = true
        seenCount++

        if (ore < 0 || cla < 0 || obs < 0 || geo < 0) throw state


        if (ore >= geoCostOre && obs >= geoCostObs) {
            queue.push([ore + rOre - geoCostOre, cla + rCla, obs + rObs - geoCostObs, geo + rGeo, rOre, rCla, rObs, rGeo + 1, timeLeft - 1])
        } else {
            queue.push([ore + rOre, cla + rCla, obs + rObs, geo + rGeo, rOre, rCla, rObs, rGeo, timeLeft - 1])
            if (ore >= oreCostOre) {
                queue.push([ore + rOre - oreCostOre, cla + rCla, obs + rObs, geo + rGeo, rOre + 1, rCla, rObs, rGeo, timeLeft - 1])
            }
            if (ore >= claCostOre) {
                queue.push([ore + rOre - claCostOre, cla + rCla, obs + rObs, geo + rGeo, rOre, rCla + 1, rObs, rGeo, timeLeft - 1])
            }
            if (ore >= obsCostOre && cla >= obsCostCla) {
                queue.push([ore + rOre - obsCostOre, cla + rCla - obsCostCla, obs + rObs, geo + rGeo, rOre, rCla, rObs + 1, rGeo, timeLeft - 1])
            }
        }
    }

    return best
}

function part1(schemas) {
    let scores = schemas.map(schema => {
        let maxGeo = search(schema.ore.ore, schema.cla.ore, schema.obs.ore, schema.obs.cla, schema.geo.ore, schema.geo.obs, 24)
        return schema.id * maxGeo
    });
    return scores.reduce((p, c) => p + c, 0)
}

function part2(schemas) {
    let checkSchemas = schemas.slice(0, 3)
    let scores = checkSchemas.map((schema, i) => {
        let maxGeo = search(schema.ore.ore, schema.cla.ore, schema.obs.ore, schema.obs.cla, schema.geo.ore, schema.geo.obs, 32)
        return maxGeo
    });
    return scores.reduce((p, c) => p * c, 1)
}

function run(input) {
    let t0 = performance.now()
    let result1, result2;

    let schemas = getSchema(input)

    let t1 = performance.now()
    console.log(`Pre-processing took ${~~(t1 - t0)}ms`);

    result1 = part1(schemas)
    let t2 = performance.now()
    console.log(`19a: ${~~(t2 - t1)}ms ${result1}`);

    result2 = part2(schemas)
    let t3 = performance.now()
    console.log(`19b: ${~~(t3 - t2)}ms ${result2}`);
}

function execute() {
    readFile('./2022/day19/day19.txt').then(value => run(value.toString()));
    // readFile('./2022/day19/day19.test.txt').then(value => run(value.toString()));
}

export default { execute }