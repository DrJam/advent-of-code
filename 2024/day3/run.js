import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";

let mulPairPattern = /mul\((\d+)\,(\d+)\)/gm;
let toggleMulPairPattern = /do(?:n\'t)?\(\)|mul\((\d+)\,(\d+)\)/gm;

function getMulPairs(input) {
  let mulPairs = [];
  let toggleMulPairs = [];
  let match;
  while ((match = toggleMulPairPattern.exec(input)) !== null) {
    if (match[1] || match[2]) {
      mulPairs.push([parseInt(match[1], 10), parseInt(match[2], 10)]);
      toggleMulPairs.push([parseInt(match[1], 10), parseInt(match[2], 10)]);
    } else {
      toggleMulPairs.push(match[0] == "do()");
    }
  }
  return [mulPairs, toggleMulPairs];
}

function getSumProducts(pairs) {
  let enabled = true;
  return pairs.reduce((acc, pair) => {
    if (pair === true || pair === false) {
      enabled = pair;
      return acc;
    }
    if (!enabled) {
      return acc;
    }
    return acc + pair[0] * pair[1];
  }, 0);
}

function run(input) {
  let [mulPairs, toggleMulPairs] = getMulPairs(input);
  let sumProducts = getSumProducts(mulPairs);
  let sumToggleProducts = getSumProducts(toggleMulPairs);
  console.log(sumProducts);
  console.log(sumToggleProducts);
}

function execute() {
  // readFile("./2024/day3/test.txt").then((value) => run(value.toString()));
  readFile("./2024/day3/input.txt").then((value) => run(value.toString()));
}

export default { execute };
