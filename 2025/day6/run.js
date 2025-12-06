import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";

function getProcessedLinesPart1(input, height) {
  let lines = common.getLines(input);
  lines = lines.map((line) => line.replace(/\s+/g, " ").trim());
  lines = lines.map((line, index) => {
    if (index < height) {
      return line.split(" ").map((char) => parseInt(char, 10));
    } else {
      return line.split(" ");
    }
  });
  return lines;
}

function getMathGroupsPart1(lines, height) {
  let groups = [];
  for (let i = 0; i < lines[0].length; i++) {
    let group = {
      items: [],
      operator: null,
    };
    for (let j = 0; j < height; j++) {
      group.items.push(lines[j][i]);
    }
    group.operator = lines[height][i];
    groups.push(group);
  }
  return groups;
}

function getMathGroupsPart2(input, height) {
  let lines = common.getLines(input);
  let length = lines[0].length;
  let groups = [];
  let currentGroup = null;
  for (let i = length - 1; i >= 0; i--) {
    if (!currentGroup) {
      currentGroup = {
        items: [],
        operator: null,
      };
    }
    let numberString = "";
    for (let j = 0; j < height; j++) {
      numberString += lines[j][i];
    }
    if (numberString.length > 0 && numberString.trim() !== "") {
      currentGroup.items.push(parseInt(numberString.trim(), 10));
    }
    if (lines[height][i] !== " ") {
      currentGroup.operator = lines[height][i];
      groups.unshift(currentGroup);
      currentGroup = null;
    }
  }

  return groups;
}

function getResult(groups) {
  let total = 0;
  groups.forEach((group) => {
    if (group.operator === "+") {
      total += group.items.reduce((a, b) => a + b, 0);
    } else if (group.operator === "*") {
      total += group.items.reduce((a, b) => a * b, 1);
    }
  });
  return total;
}

function run(input, height) {
  let lines1 = getProcessedLinesPart1(input, height);
  let groups1 = getMathGroupsPart1(lines1, height);
  let part1 = getResult(groups1);
  console.log("Part 1: ", part1);

  let groups2 = getMathGroupsPart2(input, height);
  let part2 = getResult(groups2);
  console.log("Part 2: ", part2);
}

function execute() {
  // readFile("./2025/day6/test.txt").then((value) => run(value.toString(), 3));
  readFile("./2025/day6/input.txt").then((value) => run(value.toString(), 4));
}

export default { execute };
