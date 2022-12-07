const fs = require('fs');

fs.readFile('./day-6.txt', 'utf8', (err, value) => {
    day6(value);
})

function getMatchIndex(chars, targetSize) {
    for (let i = targetSize; i < chars.length; i++) {
        let checkSet = chars.slice(i - targetSize, i);
        let match = checkSet.some((x, i) => checkSet.some((y, j) => x == y && i != j))
        if (!match) {
            return i;
        }
    }
}

function day6(input) {
    let chars = input.split('');

    console.log(getMatchIndex(chars, 4))
    console.log(getMatchIndex(chars, 14))
}