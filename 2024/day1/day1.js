import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";

function getlists(lines) {
  let lists = [[], []];
  lines.forEach((x) => {
    let halves = x.split("   ");
    halves = halves.map((y) => parseInt(y));
    lists[0].push(halves[0]);
    lists[1].push(halves[1]);
  });
  return lists;
}

function getDistances(left, right) {
  let distances = [];
  for (let i = 0; i < left.length; i++) {
    let distance = Math.abs(left[i] - right[i]);
    distances.push(distance);
  }
  return distances;
}

function getPart2(left, right) {
  let acc = 0;
  left.forEach((x) => {
    let count = right.filter((y) => y == x).length;
    acc += count * x;
  });
  return acc;
}

function run(input) {
  let lines = common.getLines(input);
  let [left, right] = getlists(lines);
  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);
  let distances = getDistances(left, right);
  let sum = distances.reduce((acc, val) => acc + val, 0);
  console.log(sum);
  let part2 = getPart2(left, right);
  console.log(part2);
}

function execute() {
  readFile("./2024/day1/day1.txt").then((value) => run(value.toString()));
}

export default { execute };
