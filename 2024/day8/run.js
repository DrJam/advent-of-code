import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";

function getData(lines) {
  let data = {};
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (lines[y][x] === ".") {
        continue;
      } else {
        let label = lines[y][x];
        if (data[label] === undefined) {
          data[label] = [];
        }
        data[label].push([x, y]);
      }
    }
  }
  return data;
}

function getAntinodes1(data, size) {
  let antinodes = {};
  for (const frequency in data) {
    let antennae = data[frequency];
    for (let a = 0; a < antennae.length; a++) {
      for (let b = 0; b < antennae.length; b++) {
        if (a === b) {
          continue;
        }
        let antennaA = antennae[a];
        let antennaB = antennae[b];
        let deltaX = antennaB[0] - antennaA[0];
        let deltaY = antennaB[1] - antennaA[1];
        let dXDivisible = deltaX % 3 === 0;
        let dYDivisible = deltaY % 3 === 0;
        if (dXDivisible && dYDivisible) {
          let x = antennaA[0] + deltaX / 3;
          let y = antennaA[1] + deltaY / 3;
          let x2 = antennaA[0] + (2 * deltaX) / 3;
          let y2 = antennaA[1] + (2 * deltaY) / 3;
          antinodes[`${x},${y}`] = true;
          antinodes[`${x2},${y2}`] = true;
        }

        let test1X = antennaA[0] + deltaX * 2;
        let test1Y = antennaA[1] + deltaY * 2;
        if (test1X >= 0 && test1X < size && test1Y >= 0 && test1Y < size) {
          antinodes[`${test1X},${test1Y}`] = true;
        }

        let test2X = antennaA[0] - deltaX;
        let test2Y = antennaA[1] - deltaY;
        if (test2X >= 0 && test2X < size && test2Y >= 0 && test2Y < size) {
          antinodes[`${test2X},${test2Y}`] = true;
        }
      }
    }
  }
  return antinodes;
}

function getAntinodes2(data, size) {
  let antinodes = {};
  for (const frequency in data) {
    let antennae = data[frequency];
    for (let a = 0; a < antennae.length; a++) {
      for (let b = 0; b < antennae.length; b++) {
        if (a === b) {
          continue;
        }
        
        let antennaA = antennae[a];
        let antennaB = antennae[b];
        let deltaX = antennaB[0] - antennaA[0];
        let deltaY = antennaB[1] - antennaA[1];

        let gcd = common.gcd(deltaX, deltaY);
        let dX = deltaX / gcd;
        let dY = deltaY / gcd;

        let x = antennaA[0];
        let y = antennaA[1];
        while (x >= 0 && x < size && y >= 0 && y < size) {
          antinodes[`${x},${y}`] = true;
          x += dX;
          y += dY;
        }

        x = antennaA[0] - dX;
        y = antennaA[1] - dY;
        while (x >= 0 && x < size && y >= 0 && y < size) {
          antinodes[`${x},${y}`] = true;
          x -= dX;
          y -= dY;
        }
      }
    }
  }
  return antinodes;
}

function run(input) {
  let lines = common.getLines(input);
  lines = lines.map((line) => line.split(""));
  let gridSize = lines.length;
  let data = getData(lines);
  let antinodes1 = getAntinodes1(data, gridSize);
  let count = Object.keys(antinodes1).length;
  console.log(count);
  let antinodes2 = getAntinodes2(data, gridSize);
  count = Object.keys(antinodes2).length;
  console.log(count);
}

function execute() {
  // readFile("./2024/day8/test.txt").then((value) => run(value.toString()));
  readFile("./2024/day8/input.txt").then((value) => run(value.toString()));
}

export default { execute };
