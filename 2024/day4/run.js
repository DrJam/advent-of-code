import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";

function checkXMAS(array, x, y, dx, dy) {
  let hunt = "XMAS".split("");
  let size = array.length;
  for (var i = 0; i < 4; i++) {
    if (x + i * dx < 0 || x + i * dx >= size) {
      return false;
    }
    if (array[x + i * dx][y + i * dy] !== hunt[i]) {
      return false;
    }
  }
  return true;
}

function checkCross(array, x, y) {
  return (
    array[x + 1][y + 1] == "A" &&
    ((array[x][y] == "M" && array[x + 2][y + 2] == "S") ||
      (array[x][y] == "S" && array[x + 2][y + 2] == "M")) &&
    ((array[x][y + 2] == "M" && array[x + 2][y] == "S") ||
      (array[x][y + 2] == "S" && array[x + 2][y] == "M"))
  );
}

function run(input) {
  let lines = common.getLines(input);
  lines = lines.map((line) => line.split(""));
  let size = lines.length;
  let countWord = 0;
  let countCross = 0;
  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      for (var dx = -1; dx <= 1; dx++) {
        for (var dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) {
            continue;
          }
          if (checkXMAS(lines, x, y, dx, dy)) {
            countWord++;
          }
        }
      }

      if (y > size - 3 || x > size - 3) {
        break;
      }

      if (checkCross(lines, x, y)) {
        // console.log("Cross found at", x, y);
        countCross++;
      }
    }
  }
  console.log(countWord, countCross);
}

function execute() {
  readFile("./2024/day4/test.txt").then((value) => run(value.toString()));
  readFile("./2024/day4/input.txt").then((value) => run(value.toString()));
}

export default { execute };
