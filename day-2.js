const fs = require('fs');

fs.readFile('./day-2.txt', 'utf8', (err, value) => {
    day2(value);
})

// The winner of the whole tournament is the player with the highest score. 
// Your total score is the sum of your scores for each round. 
// The score for a single round is the score for the shape you selected (1 for Rock, 2 for Paper, and 3 for Scissors) 
//     plus the score for the outcome of the round (0 if you lost, 3 if the round was a draw, and 6 if you won).

// X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win


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

function day2(input) {
    let characterToScore = {
        A: 1, B: 2, C: 3, X: 1, Y: 2, Z: 3
    }
    let games = input.split('\r\n').map(x => x.split(' ')).map(game => [characterToScore[game[0]], characterToScore[game[1]]]);
    let scores = games.map(x => gameScore(x[0], x[1]) + x[1]);
    let total = scores.reduce((p, c) => p + c, 0)

    let part2Games = games.map(x => [...x, getNeededMove(x[0], x[1])])
    let part2Scores = part2Games.map(x => gameScore(x[0], x[2]) + x[2]);
    let part2Total = part2Scores.reduce((p, c) => p + c, 0)

    console.log(total, part2Total)
    debugger;
}