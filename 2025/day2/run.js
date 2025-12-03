import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";

function hasRepeats(testString, divisor) {
  if (testString.length % divisor != 0) return false;
  let step = testString.length / divisor;
  if (step == testString.length) return false;
  let index = 0;
  while ((index + step) < testString.length) {
    let part = testString.substring(index, index + step);
    let nextPart = testString.substring(index + step, index + step * 2);
    if (part !== nextPart) {
      return false;
    }
    index += step;
  }
  console.log(testString)
  return true;
}

function run(input) {
  let lines = common.getLines(input);
  let pairs = lines[0].split(",");

  pairs = pairs.map((pair) => {
    const [a, b] = pair.split("-");
    return [parseInt(a, 10), parseInt(b, 10)];
    // return [a,b]
  });

  let repeatsInHalves = [];
  let repeatsInAny = [];
  pairs.forEach((pair) => {
    // if (pair[0] > pair[1]) return;
    // let [a, b] = pair.map((x) => x.toString());
    // if (a.length == b.length && a.length % 2 != 0) return;

    for (
      let currentNumber = pair[0];
      currentNumber <= pair[1];
      currentNumber++
    ) {
      let testString = currentNumber.toString();
      if (hasRepeats(testString, 2)) repeatsInHalves.push(currentNumber);
      for (let divisor = 2; divisor <= testString.length; divisor++) {
        if (hasRepeats(testString, divisor)) {
          repeatsInAny.push(currentNumber);
          break;
        }
      }
    }
  });
  // console.log(lines);
  console.log(
    "Result 1:",
    repeatsInHalves.reduce((a, b) => a + b, 0)
  );
  console.log(
    "Result 2:",
    repeatsInAny.reduce((a, b) => a + b, 0)
  );
}

function execute() {
  // readFile("./2025/day2/test.txt").then((value) => run(value.toString()));
  // readFile("./2025/day2/input.txt").then((value) => run(value.toString()));
  readFile("./2025/day2/input_harb.txt").then((value) => run(value.toString()));
}

export default { execute };
