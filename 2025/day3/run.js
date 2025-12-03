import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";

function run(input) {
  let lines = common.getLines(input);
  console.log('test');
}

function execute() {
  readFile("./2025/day3/test.txt").then((value) => run(value.toString()));
  readFile("./2025/day3/input.txt").then((value) => run(value.toString()));
}

export default { execute };
