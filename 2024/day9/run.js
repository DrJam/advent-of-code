import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";

function findLast(list, condition) {
  return list.reduceRight((lastIndex, currentValue, currentIndex) => {
    if (lastIndex === -1 && condition(currentValue)) {
      return currentIndex;
    }
    return lastIndex;
  }, -1);
}

function findFirst(list, condition) {
  return list.reduce((lastIndex, currentValue, currentIndex) => {
    if (lastIndex === -1 && condition(currentValue)) {
      return currentIndex;
    }
    return lastIndex;
  }, -1);
}

function swap(arr, pos1, pos2) {
  [arr[pos1], arr[pos2]] = [arr[pos2], arr[pos1]];
  return arr;
}

function getDataPart1(lines) {
  let currentId = 0;
  let storage = [];
  lines[0].split("").map((x, i) => {
    let isEven = i % 2 === 0;
    if (isEven) {
      for (let n = 0; n < x; n++) {
        storage.push(currentId);
      }
      currentId++;
    } else {
      for (let n = 0; n < x; n++) {
        storage.push(".");
      }
    }
  });
  return storage;
}

function getSortedData(initial) {
  let data = [...initial];
  let firstSpaceIndex = findFirst(data, (x) => x === ".");
  let lastValueIndex = findLast(data, (x) => x !== ".");
  while (firstSpaceIndex < lastValueIndex) {
    data = swap(data, firstSpaceIndex, lastValueIndex);
    firstSpaceIndex = findFirst(data, (x) => x === ".");
    lastValueIndex = findLast(data, (x) => x !== ".");
  }
  return data;
}

function getChecksum(data) {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== ".") {
      sum += parseInt(data[i], 10) * i;
    }
  }
  return sum;
}

function getDataPart2(lines) {
  let currentId = 0;
  let storage = [];
  lines[0].split("").map((x, i) => {
    if (x === "0") return;
    let isEven = i % 2 === 0;
    if (isEven) {
      storage.push([currentId, parseInt(x, 10)]);
      currentId++;
    } else {
      storage.push([".", parseInt(x, 10)]);
    }
  });
  return storage;
}

function getSmallestSpaceIndex(data) {
  return data.reduce((lastIndex, currentValue, currentIndex) => {
    if (currentValue[0] !== ".") return lastIndex;
    if (lastIndex === -1 && currentValue[0] === ".") return currentIndex;
    if (currentValue[1] < data[lastIndex][1]) return currentIndex;
    return lastIndex;
  }, -1);
}

function get(data, attemptedToMove) {
  let lastValueIndex = -1,
    lastValueSize,
    firstSpaceIndex = -1,
    firstSpaceSize;
  while (lastValueIndex === -1) {
    lastValueIndex = findLast(
      data,
      (x) => x[0] !== "." && !attemptedToMove[x[0]]
    );

    if (lastValueIndex === -1) {
      return [-1, 0, -1, 0];
    }

    lastValueSize = data[lastValueIndex][1];
    attemptedToMove[data[lastValueIndex][0]] = true;
    firstSpaceIndex = findFirst(
      data,
      (x) => x[0] === "." && x[1] >= lastValueSize
    );
    attemptedToMove[data[lastValueIndex][0]] = true;
    if (firstSpaceIndex === -1) {
      lastValueIndex = -1;
      continue;
    }
    firstSpaceSize = data[firstSpaceIndex][1];
  }
  return [lastValueIndex, lastValueSize, firstSpaceIndex, firstSpaceSize];
}

function getSortedData2(initial) {
  let data = [...initial];
  let attemptedToMove = {};
  let [lastValueIndex, lastValueSize, firstSpaceIndex, firstSpaceSize] = get(
    data,
    attemptedToMove
  );

  while (lastValueIndex !== -1 && firstSpaceIndex !== -1) {
    if (firstSpaceIndex > -1 && firstSpaceIndex < lastValueIndex) {
      data = swap(data, firstSpaceIndex, lastValueIndex);
      let spaceIndex = lastValueIndex; //swapped positions now
      let valueIndex = firstSpaceIndex;
      if (firstSpaceSize > lastValueSize) {
        data[spaceIndex][1] = lastValueSize;
        data.splice(valueIndex + 1, 0, [".", firstSpaceSize - lastValueSize]);
      }
    }
    [lastValueIndex, lastValueSize, firstSpaceIndex, firstSpaceSize] = get(
      data,
      attemptedToMove
    );
  }
  return data;
}

function getChecksum2(initial) {
  let data = [];
  initial.forEach((point) => {
    let len = point[1];
    let id = point[0];
    for (let i = 0; i < len; i++) {
      data.push(id);
    }
  });
  console.log(data.join(""));
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== ".") {
      sum += parseInt(data[i], 10) * i;
    }
  }
  return sum;
}

function run(input) {
  let lines = common.getLines(input);
  let data = getDataPart1(lines);
  let data2 = getDataPart2(lines);
  // let sortedData = getSortedData(data);
  // let checksum = getChecksum(sortedData);
  let sortedData2 = getSortedData2(data2);
  let checksum2 = getChecksum2(sortedData2);
  console.log("part 1", 1928, 6154342787400);
  console.log("part 2", 2858, checksum2);
}

function execute() {
  // readFile("./2024/day9/test.txt").then((value) => run(value.toString()));
  readFile("./2024/day9/input.txt").then((value) => run(value.toString()));
}

export default { execute };
