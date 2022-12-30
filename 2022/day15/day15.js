import { readFile } from 'node:fs/promises'
import * as common from '../../common/common.js'

const abs = (v) => (v ^ (v >> 31)) - (v >> 31)
const mDist = ([x1, y1], [x2, y2]) => abs(x2 - x1) + abs(y2 - y1)

function getSensors(input) {
    let lines = input.split(common.newline)
    let sensors = lines.map(line => {
        let [sensorPart, beaconPart] = line.split(': ')

        let sensorCoordString = sensorPart.split('at ')[1]
        let [sensorXPart, sensorYPart] = sensorCoordString.split(', ')
        let sensorX = parseInt(sensorXPart.split('=')[1])
        let sensorY = parseInt(sensorYPart.split('=')[1])

        let beaconCoordString = beaconPart.split('at ')[1]
        let [beaconXPart, beaconYPart] = beaconCoordString.split(', ')
        let beaconX = parseInt(beaconXPart.split('=')[1])
        let beaconY = parseInt(beaconYPart.split('=')[1])

        let position = [sensorX, sensorY]
        let beacon = [beaconX, beaconY];
        return {
            position: position,
            beacon: beacon,
            mDist: mDist(position, beacon)
        }
    })
    return sensors;
}

function getCoveragesOnRow(y, sensors) {
    let coverages = []
    let yDiff, xRange, fromX, toX

    sensors.forEach((sensor) => {
        if ((y > sensor.position[1] + sensor.mDist)
            || (y < sensor.position[1] - sensor.mDist)) {
            return; //sensor cannot possibly see y
        }
        yDiff = abs(y - sensor.position[1])
        xRange = sensor.mDist - yDiff
        toX = sensor.position[0] + xRange
        fromX = sensor.position[0] - xRange
        coverages.push([fromX, toX])
    });

    coverages = coverages.sort((a, b) => a[0] - b[0])
    coverages = coverages.reduce((result, current) => {
        if (!result.length) return [current]
        const last = result[result.length - 1]
        if (last[1] >= current[0]) {
            last[1] = Math.max(last[1], current[1])
        } else {
            result.push(current)
        }
        return result
    }, [])

    let flat = coverages.flat(1)
    let min = Math.min(...flat)
    let max = Math.max(...flat)

    return [coverages, min, max];
}

function getPart1(y, sensors) {
    let tiles = 0

    let [coverages, min, max] = getCoveragesOnRow(y, sensors)

    for (let x = min; x <= max; x++) {
        if (coverages.find(([cMin, cMax]) => x >= cMin && x <= cMax) //if X position is seen
            && !sensors.find(sensor => sensor.beacon[1] == y && sensor.beacon[0] == x)) { //and not a beacon
            tiles++
        }
    }
    return tiles
}

function getPart2(sensors, maxPos) {
    let xMin = 0
    let xMax = maxPos
    let result;
    for (let y = 0; y <= maxPos; y++) { //iterate over all 400mill or whatever the number is
        if (result) return result[0] * 4000000 + result[1] //if we have an answer from the prev loop escape
        let [coverages, min, max] = getCoveragesOnRow(y, sensors) //get seen ranges, usually 1 range
        if (coverages.length == 1 && min <= xMin && max >= xMax) { continue } //if whole x range seen, cont
        if (xMin < coverages[0][0]) result = [xMin, y] //if the first tile isn't seen, save it
        if (xMax > coverages[coverages.length - 1][1]) result = [xMax, y] //if the last tile isn't seen
        if (coverages.length == 2) result = [coverages[0][1] + 1, y] //otherwise it's between two ranges
    }
    return result[0] * 4000000 + result[1] //stupid maths
}

function run(input) {
    let result1, result2;
    let sensors = getSensors(input)

    let t0 = performance.now();

    result1 = getPart1(2000000, sensors)

    let t1 = performance.now();
    console.log(`15a: ${~~(t1 - t0)}ms ${result1} `)

    result2 = getPart2(sensors, 4000000)

    let t2 = performance.now();
    console.log(`15b: ${~~(t2 - t1)}ms ${result2} `)
}

function execute() {
    readFile('./2022/day15/day15.txt').then(value => run(value.toString()));
}

export default { execute }