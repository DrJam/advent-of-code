import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";

let getCanBeFixed = (line, index) => {
  let temp1 = [...line];
  temp1.splice(index, 1);
  let temp2 = [...line];
  temp2.splice(index + 1, 1);
  let [isSafe1, canBeFixed1] = checkSafe(temp1);
  let [isSafe2, canBeFixed2] = checkSafe(temp2);
  return isSafe1 || isSafe2;
};

let checkSafe = (line) => {
  let directionIsPositive;

  for (let i = 0; i < line.length - 1; i++) {
    const now = line[i];
    const next = line[i + 1];
    let currentDiff = next - now;

    if (i == 0) {
      directionIsPositive = currentDiff > 0;
    }

    if (directionIsPositive != currentDiff > 0) {
      let canBeFixed1 = getCanBeFixed(line, i - 1);
      let canBeFixed2 = getCanBeFixed(line, i);
      return [false, canBeFixed1 || canBeFixed2];
    }

    let absDiff = Math.abs(currentDiff);
    if (absDiff < 1 || absDiff > 3) {
      let canBeFixed = getCanBeFixed(line, i);
      return [false, canBeFixed];
    }
  }
  return [true, true];
};

function run(input) {
  let lines = common.getLines(input);
  lines = lines.map((line) => {
    return line.split(" ").map((x) => parseInt(x, 10));
  });

  let safeCount = lines.reduce(
    ([acc1, acc2], line) => {
      let [safe, canBeFixed] = checkSafe(line);
      if (safe) {
        return [acc1 + 1, acc2 + 1];
      }
      return [acc1, acc2 + (canBeFixed ? 1 : 0)];
    },
    [0, 0]
  );

  console.log(safeCount);
}

function execute() {
  readFile("./2024/day2/day2.txt").then((value) => run(value.toString()));
}

export default { execute };
