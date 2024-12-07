import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";
import test from "node:test";

function fromLines(lines) {
  let pos = { x: 0, y: 0 };
  let blocked = {};
  let dir = 0;
  lines.forEach((line, y) => {
    line.forEach((c, x) => {
      if (c == "^") {
        pos = { x, y };
      } else if (c == "#") {
        blocked[`${x},${y}`] = true;
      }
    });
  });
  let size = lines.length;
  return [blocked, pos, dir, size];
}

function debugOutput(cx, cy, dir, size, rocks, visited) {
  console.clear();
  for (let y = 0; y < size; y++) {
    let line = "";
    for (let x = 0; x < size; x++) {
      let pos = `${x},${y}`;
      if (rocks[pos]) {
        line += "#";
      } else if (visited[`${x},${y}`]) {
        line += "o";
      } else if (cx == x && cy == y) {
        switch (dir) {
          case 0:
            line += "^";
            break;
          case 1:
            line += ">";
            break;
          case 2:
            line += "v";
            break;
          case 3:
            line += "<";
            break;
        }
      } else {
        line += ".";
      }
    }
    console.log(line);
  }
  console.log();
}

function explore(blocked, startPosition, startDirection, size) {
  let start = `${startPosition.x},${startPosition.y},${startDirection}`;
  let startPos = `${startPosition.x},${startPosition.y}`;
  let visited = { [startPos]: true };
  let states = { [start]: true };

  let x = startPosition.x;
  let y = startPosition.y;
  let dir = startDirection;

  let outOfBounds = false;
  let looped = false;

  while (!outOfBounds && !looped) {
    let testx, testy;
    let turned = false;
    switch (dir) {
      case 0:
        testx = x;
        testy = y - 1;
        break;
      case 1:
        testx = x + 1;
        testy = y;
        break;
      case 2:
        testx = x;
        testy = y + 1;
        break;
      case 3:
        testx = x - 1;
        testy = y;
        break;
    }

    if (testx < 0 || testx >= size || testy < 0 || testy >= size) {
      outOfBounds = true;
      break;
    }

    let rockInTheWay = blocked[`${testx},${testy}`];
    if (rockInTheWay) {
      dir = (dir + 1) % 4;
    } else {
      x = testx;
      y = testy;
    }

    let pos = `${x},${y}`;
    visited[pos] = true;

    let currentRef = `${x},${y},${dir}`;
    if (states[currentRef]) {
      looped = true;
      break;
    }

    states[currentRef] = true;
  }

  return [visited, looped];
}

function checkAllRockPositionsAndReturnLoopOptions(blocked, startPosition, dir, size) {
  let possibilities = {};

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let pos = `${x},${y}`;

      if (blocked[pos] || pos == `${startPosition.x},${startPosition.y}`) {
        continue;
      }

      let tempBlocked = { ...blocked };
      tempBlocked[pos] = true;
      console.log(`Checking ${size * y + x + 1}/${size * size}`);
      let [visited, looped] = explore(tempBlocked, startPosition, dir, size);
      if (looped) {
        possibilities[pos] = true;
      }
    }
  }

  return possibilities;
}

function run(input) {
  let lines = common.getLines(input);
  lines = lines.map((line) => line.split(""));
  let [blocked, startPosition, dir, size] = fromLines(lines);
  let [visited, looped] = explore(blocked, startPosition, dir, size);
  let countPos = Object.keys(visited).length;
  console.log(countPos, looped);
  let loopingRocks = checkAllRockPositionsAndReturnLoopOptions(blocked, startPosition, dir, size);
  let countLoopOptions = Object.keys(loopingRocks).length;
  console.log(countLoopOptions);
}

function execute() {
  // readFile("./2024/day6/test.txt").then((value) => run(value.toString()));
  // readFile("./2024/day6/test2.txt").then((value) => run(value.toString()));
  readFile("./2024/day6/input.txt").then((value) => run(value.toString()));
}

export default { execute };
