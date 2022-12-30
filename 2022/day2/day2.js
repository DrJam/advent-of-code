import { readFile } from 'node:fs/promises';;

function gameScore(opp, me) {
    let score = me - opp + 1;
    if (score < 0) score += 3;
    if (score > 2) score -= 3;
    return score * 3;
}

function getNeededMove(opp, result) {
    let output = opp + result - 2;
    if (output < 1) output += 3;
    if (output > 3) output -= 3;
    return output;
}

function run(input) {
    let characterToScore = {
        A: 1, B: 2, C: 3, X: 1, Y: 2, Z: 3
    };
    let games = input.split('\r\n').map(x => x.split(' ')).map(game => [characterToScore[game[0]], characterToScore[game[1]]]);
    let scores = games.map(x => gameScore(x[0], x[1]) + x[1]);
    let total = scores.reduce((p, c) => p + c, 0);

    let part2Games = games.map(x => [...x, getNeededMove(x[0], x[1])]);
    let part2Scores = part2Games.map(x => gameScore(x[0], x[2]) + x[2]);
    let part2Total = part2Scores.reduce((p, c) => p + c, 0);

    console.log(`02a: ${total}`);
    console.log(`02b: ${part2Total}`);
}


function execute() {
    readFile('./2022/day2/day2.txt').then(value => run(value.toString()));
}

export default { execute }