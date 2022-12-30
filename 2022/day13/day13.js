import { readFile } from 'node:fs/promises';
import * as common from '../../common/common.js';

const isInt = (num) => Number.isInteger(num); //shorthand for isInteger
const isArray = (array) => Array.isArray(array); //shorthand for isArray

function getPackets(packetsText) { //split by line, delete empty lines, evaluate object expression
    return packetsText.split(common.newline).filter(x => x != '').map(x => eval(x));
}

function getPacketPairs(input) { //split by empty line, map lines to packets
    return input.split(common.doubleNewline).map(packetsText => getPackets(packetsText))
}

function compare(left, right) {
    if (isInt(left) && isInt(right)) { //if both ints, compare and return
        if (left < right) {
            return -1
        } else if (left > right) {
            return 1
        }
        return 0
    } else if (isInt(left) && isArray(right)) { //if one is list, convert other and compare lists
        return compare([left], right)
    } else if (isArray(left) && isInt(right)) { //as prev block
        return compare(left, [right])
    } else if (isArray(left) && isArray(right)) { //if both lists, compare elements
        let short = Math.min(left.length, right.length)
        let leftIsShort = short == left.length
        let rightIsShort = short == right.length
        for (let i = 0; i < short; i++) {
            let comparison = compare(left[i], right[i]);
            if (comparison === -1) { //stop early if it finds a positive or negative result
                return -1
            } else if (comparison === 1) {
                return 1
            }
        }
        if (leftIsShort && !rightIsShort) { //if no results found, compare list lengths for result
            return -1
        } else if (rightIsShort && !leftIsShort) {
            return 1;
        }
        return 0;
    }
    throw 'uh oh!' //shouldn't reach here
}

function getPart1(pairs) {
    let indices = [];

    pairs.forEach(([left, right], i) => { //break pairs into left and right
        if (compare(left, right) === -1) { //if in ascending order, add index to list
            indices.push(i + 1);
        }
    });

    return indices.reduce((p, c) => p + c, 0); //sum indices
}

function getPart2(packets) {
    let aIndex, bIndex;
    let a = [[2]]
    let b = [[6]]

    packets.push(a, b) //add pre-defined markers
    let sorted = packets.sort(compare) //sort by comparison function

    sorted.forEach((packet, i) => { //search for marker objects by reference
        if (packet == a) aIndex = i + 1
        if (packet == b) bIndex = i + 1
    });

    return aIndex * bIndex //return product of indices
}

function run(input) {
    let result1, result2;

    let pairs = getPacketPairs(input) //get lists of pairs
    let packets = getPackets(input) //get all packets as one list

    result1 = getPart1(pairs)
    result2 = getPart2(packets)

    console.log(`13a: ${result1}`);
    console.log(`13b: ${result2}`);
}

function execute() {
    readFile('./2022/day13/day13.txt').then(value => run(value.toString()));
}

export default { execute }