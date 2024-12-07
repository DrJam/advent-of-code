import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";

function getData(lines) {
  let data = [];
  lines.forEach((line) => {
    let parts = line.split(": ");
    let left = parseInt(parts[0], 10);
    let rightParts = parts[1].split(" ").map((x) => parseInt(x, 10));
    let item = { result: left, values: rightParts, isValid: null };
    data.push(item);
  });
  return data;
}

function getValid(data, numOperators) {
  data.forEach((item) => {
    let size = Math.pow(numOperators, item.values.length - 1);
    for (let eq = 0; eq < size; eq++) {
      if (item.isValid) {
        break;
      }

      let testValue = item.values.reduce((acc, value, i, a) => {
        if (i == item.values.length - 1) {
          return acc;
        }

        let op = Math.floor(eq / Math.pow(numOperators, i)) % numOperators;
        if (op === 0) {
          return acc + a[i + 1];
        } else if (op === 1) {
          return acc * a[i + 1];
        } else {
          return parseInt(acc.toString() + a[i + 1].toString(), 10);
        }
      }, item.values[0]);

      if (testValue === item.result) {
        item.isValid = true;
      }
    }
  });

  return data.filter((x) => x.isValid);
}

function run(input) {
  let lines = common.getLines(input);
  let data = getData(lines);
  let validDataPart1 = getValid(data, 2);
  let sum1 = validDataPart1.reduce((acc, x) => acc + x.result, 0);
  console.log(sum1);
  let validDataPart2 = getValid(data, 3);
  let sum2 = validDataPart2.reduce((acc, x) => acc + x.result, 0);
  console.log(sum2);
}

function execute() {
  // readFile("./2024/day7/test.txt").then((value) => run(value.toString()));
  readFile("./2024/day7/input.txt").then((value) => run(value.toString()));
}

export default { execute };
