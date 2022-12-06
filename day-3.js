const fs = require('fs');

fs.readFile('./day-3.txt', 'utf8', (err, value) => {
    day3(value);
})

function day3(input) {
    let backpacks = input.split('\n')
        .map(x => x.replace('\r', ''))
        .map(bp => bp.split('').map(x => x.charCodeAt(0)))
        .map(bp => bp.map(code => code > 96 ? code - 96 : code - 38));

    let halfBackpacks = backpacks.map(bp => [bp.slice(0, bp.length / 2), bp.slice(bp.length / 2, bp.length)]);
    let sumDoubles = 0;
    halfBackpacks.forEach(bp => {
        sumDoubles += bp[0].find(x => bp[1].some(y => x == y))
    });

    let sumTriples = 0;
    for (let i = 0; i < backpacks.length; i += 3) {
        sumTriples += backpacks[i].find(x => backpacks[i + 1].some(y => x == y) && backpacks[i + 2].some(z => x == z))
    }

    console.log(backpacks.length)
    console.log(backpacks.length / 3)
    console.log(sumTriples)
}