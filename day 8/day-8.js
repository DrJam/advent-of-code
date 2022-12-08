import * as fs from 'fs';

function getVisible(lines) {
    let visible = 0;
    let high = -1;
    let found = {}

    let saveFound = (x, y, n) => {
        found[`${x},${y}`] = true;
        visible++;
    };

    lines.forEach((line, y) => {
        if (y == 0 || y == lines.length - 1) {
            visible += line.length;
            return;
        }
        visible += 2;
        high = line[0];
        for (let x = 1; x < line.length - 1; x++) {
            if (line[x] > high) {
                high = line[x];
                if (!found[`${x},${y}`]) {
                    saveFound(x, y);
                }
            }
        }
        high = line[line.length - 1];
        for (let x = line.length - 2; x >= 1; x--) {
            if (line[x] > high) {
                high = line[x];
                if (!found[`${x},${y}`]) {
                    saveFound(x, y);
                }
            }
        }
    });
    lines[0].forEach((tree, x) => {
        if (x == 0 || x == (lines.length - 1)) return;

        high = lines[0][x];
        for (let y = 1; y < lines.length - 1; y++) {
            if (lines[y][x] > high) {
                high = lines[y][x];
                if (!found[`${x},${y}`]) {
                    saveFound(x, y);
                }
            }
        }
        high = lines[lines.length - 1][x];
        for (let y = lines.length - 2; y >= 1; y--) {
            if (lines[y][x] > high) {
                high = lines[y][x];
                if (!found[`${x},${y}`]) {
                    saveFound(x, y);
                }
            }
        }
    });
    return visible;
}

function runSightTest(lines, height, x, y, xMod, yMod) {
    let testX = x + xMod;
    let testY = y + yMod;
    let min = 0;
    let max = lines.length - 1;
    let counter = 0;
    while (testX >= min && testX <= max && testY >= min && testY <= max) {
        counter++;
        if (lines[testY][testX] >= height) {
            testX = testY = -1;
        } else {
            testX += xMod;
            testY += yMod;
        }
    }
    return counter;
}

function getBestScore(lines) {
    let best = 0;
    lines.forEach((line, y) => {
        line.forEach((tree, x) => {
            let score = 1;
            score = score * runSightTest(lines, tree, x, y, 0, 1);
            score = score * runSightTest(lines, tree, x, y, 0, -1);
            score = score * runSightTest(lines, tree, x, y, 1, 0);
            score = score * runSightTest(lines, tree, x, y, -1, 0);
            if (score > best) best = score;
        });
    })
    return best
}

function run(input) {
    let lines = input.split('\r\n').map(line => line.split('').map(num => parseInt(num)));
    let visible = getVisible(lines);
    let bestScore = getBestScore(lines)


    console.log(`08a: ${visible}`)
    console.log(`08b: ${bestScore}`)
}

function execute() {
    fs.readFile('./day 8/day-8.txt', 'utf8', (err, value) => run(value))
}

export { execute }