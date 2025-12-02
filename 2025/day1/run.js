import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";

function moveToBounds(current) {
  while (current > 99) {
    current -= 100;
  }

  while (current < 0) {
    current += 100;
  }

  return current;
}

function applyShift(current, number, operator) {
  return current + number * operator;
}
function applyShiftSlowlyAndCountZeroes(
  current,
  number,
  operator,
  slowZeroCount
) {
  while (number > 0) {
    current += operator;
    current = moveToBounds(current);
    if (current == 0) {
      slowZeroCount += 1;
    }
    number--;
  }
  return [current, slowZeroCount];
}

function run(input) {
  let lines = common.getLines(input);
  console.log(lines);
  let current = 50;
  let zeroCount = 0;
  let slowZeroCount = 0;
  lines.forEach((item) => {
    let letter = item.substring(0, 1);
    let number = parseInt(item.substring(1), 10);
    let operator = letter == "R" ? 1 : -1;
    // current = applyShift(current, number, operator);
    [current, slowZeroCount] = applyShiftSlowlyAndCountZeroes(
      current,
      number,
      operator,
      slowZeroCount
    );
    current = moveToBounds(current);

    if (current == 0) {
      zeroCount += 1;
    }
  });
  console.log(`zeroCount: ${zeroCount}`);
  console.log(`slowZeroCount: ${slowZeroCount}`);
}

function execute() {
  // readFile("./2025/day1/test.txt").then((value) => run(value.toString()));
  readFile("./2025/day1/input.txt").then((value) => run(value.toString()));
}

export default { execute };
