import { readFile } from "node:fs/promises";
import * as common from "../../common/common.js";

function parseLinesToRulesAndPrints(lines) {
  let rules = [];
  let prints = [];
  let switchedtoRules = true;

  lines.forEach((line) => {
    if (line == "") {
      switchedtoRules = false;
      return;
    }

    if (switchedtoRules) {
      rules.push(line.split("|").map((x) => parseInt(x, 10)));
    } else {
      prints.push(line.split(",").map((x) => parseInt(x, 10)));
    }
  });

  return [
    rules.sort((a, b) => a[0] - b[0]),
    prints, //.sort((a, b) => a.length - b.length),
  ];
}

function getWillPrintAndMids(rules, prints) {
  let willPrint = [];
  let mid = [];

  prints.forEach((print) => {
    mid.push(print[Math.floor(print.length / 2)]);

    let will = true;
    let ruleIndex = 0;
    while (will && ruleIndex < rules.length) {
      let rule = rules[ruleIndex];
      let a = print.indexOf(rule[0]);
      let b = print.indexOf(rule[1]);

      if (a == -1 || b == -1) {
        ruleIndex++;
        continue;
      }

      if (a > b) {
        will = false;
        break;
      }

      ruleIndex++;
    }

    willPrint.push(will);
  });

  return [willPrint, mid];
}

function getSumMids(willPrint, mid) {
  let sum = 0;
  willPrint.forEach((x, i) => {
    if (x) {
      sum += mid[i];
    }
  });
  return sum;
}

function getWrongPrints(willPrint, prints) {
  let wrongPrints = [];
  willPrint.forEach((will, i) => {
    if (!will) {
      wrongPrints.push(prints[i]);
    }
  });
  return wrongPrints;
}

function fix(print, rules) {
  return print.sort((a, b) => {
    let ruleLeft = rules.find((r) => r[0] == a && r[1] == b);
    if (ruleLeft) {
      return -1;
    }
    let ruleRight = rules.find((r) => r[0] == b && r[1] == a);
    if (ruleRight) {
      return 1;
    }
    return 0;
  });
}

function getFixedPrints(wrongPrints, rules) {
  let fixedPrints = [];

  wrongPrints.forEach((print) => {
    fixedPrints.push(fix(print, rules));
  });

  return fixedPrints;
}

function run(input) {
  let lines = common.getLines(input);
  let [rules, prints] = parseLinesToRulesAndPrints(lines);
  let [willPrint, mid] = getWillPrintAndMids(rules, prints);
  let wrongPrints = getWrongPrints(willPrint, prints);
  let fixedPrints = getFixedPrints(wrongPrints, rules);
  let [willPrintFixed, midFixed] = getWillPrintAndMids(rules, fixedPrints);

  let part1 = getSumMids(willPrint, mid);
  let part2 = getSumMids(willPrintFixed, midFixed);

  console.log(part1, part2);
}

function execute() {
  // readFile("./2024/day5/test.txt").then((value) => run(value.toString()));
  readFile("./2024/day5/input.txt").then((value) => run(value.toString()));
}

export default { execute };
