import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";

function getHighestTwoDigitValue(line) {
  let highestIndex = -1;
  let highestValue = -1;
  let secondHighestIndex = -1;
  let secondHighestValue = -1;

  line.forEach((value, index) => {
    if (value > highestValue && index != line.length - 1) {
      highestValue = value;
      highestIndex = index;
    }
  });
  line.forEach((value, index) => {
    if (index > highestIndex && value > secondHighestValue) {
      secondHighestValue = value;
      secondHighestIndex = index;
    }
  });
  return parseInt(`${highestValue}${secondHighestValue}`, 10);
}

function getHighestTwelveDigitValue(line, lineIndex) {
  let index = line.length - 1;
  let buildingNumber = [];
  while (index > -1) {
    if (buildingNumber.length < 12) {
      buildingNumber.unshift(line[index]);
    } else {
      let minValue = Math.min(...buildingNumber);
      let minIndex = buildingNumber.indexOf(minValue);
      let possibilityBase = buildingNumber.join("");
      let possibilityString = `${line[index]}${possibilityBase.substring(
        0,
        minIndex
      )}${possibilityBase.substring(minIndex + 1)}`;

      let possibility = parseInt(`${possibilityString}`, 10);
      let current = parseInt(buildingNumber.join(""), 10);
      if (possibility >= current) {
        buildingNumber.splice(minIndex, 1);
        buildingNumber.unshift(line[index]);
        if (lineIndex < 1) console.log(possibility + " >= " + current);
        if (lineIndex < 1) console.log(buildingNumber);
      }
    }
    index--;
  }
  return parseInt(buildingNumber.join(""), 10);
}

function getPart1(lines) {
  let runningTotal = 0;
  lines.forEach((line) => (runningTotal += getHighestTwoDigitValue(line)));
  return runningTotal;
}

function getPart2(lines) {
  let runningTotal = 0;
  lines.forEach(
    (line, index) => (runningTotal += getHighestTwelveDigitValue(line, index))
  );
  return runningTotal;
}

function run(input) {
  let lines = common.getLines(input);
  lines = lines.map((line) =>
    common.getCharacters(line).map((x) => parseInt(x, 10))
  );

  let sumJoltageP1 = getPart1(lines);
  let sumJoltageP2 = getPart2(lines);

  console.log("Part 1: ", sumJoltageP1);
  console.log("Part 2: ", sumJoltageP2);
}

function execute() {
  // readFile("./2025/day3/test.txt").then((value) => run(value.toString()));
  readFile("./2025/day3/input.txt").then((value) => run(value.toString()));
}

export default { execute };
