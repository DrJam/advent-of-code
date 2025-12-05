import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";

const MIN = 0;
const MAX = 1;

function getPart1(ranges, ingredients) {
  let count = 0;
  for (const ingredient of ingredients) {
    // check if ingredient is in any range
    let someValidRange = ranges.some(([min, max]) => ingredient >= min && ingredient <= max);
    if (someValidRange) count++;
  }
  return count;
}

function getMergedRanges(ranges) {
  let mergedRanges = [];
  for (const range of ranges) {
    if (mergedRanges.length === 0) {
      // first range
      mergedRanges.push(range);
    } else {
      // get previous merged range
      let lastRange = mergedRanges[mergedRanges.length - 1];
      if (range[MIN] <= lastRange[MAX] + 1) {
        // overlapping or adjacent ranges
        lastRange[MAX] = Math.max(lastRange[MAX], range[MAX]);
      } else {
        // non-overlapping range                                                                                 
        mergedRanges.push(range);
      }
    }
  }
}

function getIngredientCount(mergedRanges) {
  let ingredientCount = 0;
  for (const [min, max] of mergedRanges) {
    ingredientCount += max - min + 1; // size of range is diff of min & max +1
  }
  return ingredientCount;
}

function getPart2(ranges) {
  ranges.sort((a, b) => a[MIN] - b[MIN]); // sort ranges by min value
  let mergedRanges = getMergedRanges(ranges);
  let ingredientCount = getIngredientCount(mergedRanges);
  return ingredientCount;
}

function run(input) {
  let [ranges, ingredients] = common.getGroups(input);
  ranges = common.getLines(ranges).map((line) => line.split("-").map((num) => parseInt(num, 10)));
  ingredients = common.getLines(ingredients).map((line) => parseInt(line, 10));

  let part1 = getPart1(ranges, ingredients);
  let part2 = getPart2(ranges);

  console.log("Part 1:", part1);
  console.log("Part 2:", part2);
}

function execute() {
  // readFile("./2025/day5/test.txt").then((value) => run(value.toString()));
  readFile("./2025/day5/input.txt").then((value) => run(value.toString()));
}

export default { execute };
