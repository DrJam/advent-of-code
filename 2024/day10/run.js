import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";

function reachesNine(cursors, map) {
  let toCheck = [];
  if (cursors.length === 0) return [];
  for (let i = 0; i < cursors.length; i++) {
    const cursor = cursors[i];
    if (cursor === true) continue;
    let neighbours = [
      [cursor[0] - 1, cursor[1]],
      [cursor[0] + 1, cursor[1]],
      [cursor[0], cursor[1] - 1],
      [cursor[0], cursor[1] + 1],
    ]
      .filter((neighbour) => {
        return (
          neighbour[0] >= 0 &&
          neighbour[0] < map.length &&
          neighbour[1] >= 0 &&
          neighbour[1] < map[0].length &&
          map[neighbour[0]][neighbour[1]] === map[cursor[0]][cursor[1]] + 1
        );
      })
      .map((neighbour) => {
        return [neighbour[0], neighbour[1], cursor[2], false];
      });
    toCheck = toCheck.concat(neighbours);
  }
  cursors = cursors.map((cursor) => [
    cursor[0],
    cursor[1],
    cursor[2],
    map[cursor[0]][cursor[1]] === 9,
  ]);
  return cursors.concat(reachesNine(toCheck, map));
}

function getTrails(map) {
  let trailheads = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[x][y] === 0) {
        trailheads.push([x, y, [x, y], false]);
      }
    }
  }
  let reachNine = trailheads.map((trailhead) => {
    return reachesNine([trailhead], map);
  });
  return [].concat(...reachNine);
}

function run(input) {
  let lines = common.getLines(input);
  lines = lines.map((line) =>
    common.getCharacters(line).map((x) => parseInt(x, 10))
  );
  let trails = getTrails(lines);

  let startPointEndCounts = {};
  trails.forEach((trail) => {
    if (trails[3] === false) return;
    let key = `${trail[2][0]}, ${trail[2][1]}`;
    if (!startPointEndCounts[key]) startPointEndCounts[key] = 1;
    else startPointEndCounts[key]++;
  });
  let countUnique = trails.map((trail) =>
    trail.reduce((acc, val) => (val[3] == true ? acc + 1 : acc), 0)
  );
  let pairCount = Object.keys(startPointEndCounts).length;

  console.log(lines[0]);
}

function execute() {
  readFile("./2024/day10/test.txt").then((value) => run(value.toString()));
  // readFile("./2024/day10/input.txt").then((value) => run(value.toString()));
}

export default { execute };
