import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";

function outOfBounds(x, y, width, height) {
  return x < 0 || y < 0 || x >= width || y >= height;
}

function isGood(lines, x, y, width, height) {
  let count = 0;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (outOfBounds(x + dx, y + dy, width, height)) continue;
      if (lines[x + dx][y + dy] == "@") {
        count++;
      }
    }
  }

  return count < 4;
}

function getPart1(lines, width, height, remove = false) {
  let goodCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (lines[x][y] != "@") continue;
      if (isGood(lines, x, y, width, height)) {
        goodCount++;
        if (remove) lines[x][y] = ".";
      }
    }
  }
  return goodCount;
}

function getPart2(lines, width, height) {
  let result = 0;
  let removedSome = true;
  while (removedSome) {
    let removed = getPart1(lines, width, height, true);
    removedSome = removed > 0;
    result += removed;
  }
  return result;
}

function run(input) {
  let lines = common.getLines(input);
  lines = lines.map((line) => common.getCharacters(line));
  let height = lines.length;
  let width = lines[0].length;

  let part1Result = getPart1(lines, width, height);
  let part2Result = getPart2(lines, width, height);

  lines.forEach((line) => {
    console.log(line.join(" "));
  });
  console.log("Part 1 Result:", part1Result);
  console.log("Part 2 Result:", part2Result);
}

function execute() {
  // readFile("./2025/day4/test.txt").then((value) => run(value.toString()));
  readFile("./2025/day4/input.txt").then((value) => run(value.toString()));
}

export default { execute };
