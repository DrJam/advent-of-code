import * as fs from 'fs';

function run(input) {
    let crates1 = [
        ['R', 'S', 'L', 'F', 'Q'],
        ['N', 'Z', 'Q', 'G', 'P', 'T'],
        ['S', 'M', 'Q', 'B',],
        ['T', 'G', 'Z', 'J', 'H', 'C', 'B', 'Q'],
        ['P', 'H', 'M', 'B', 'N', 'F', 'S'],
        ['P', 'C', 'Q', 'N', 'S', 'L', 'V', 'G'],
        ['W', 'C', 'F'],
        ['Q', 'H', 'G', 'Z', 'W', 'V', 'P', 'M'],
        ['G', 'Z', 'D', 'L', 'C', 'N', 'R']
    ];
    let crates2 = JSON.parse(JSON.stringify(crates1));
    let pattern = /move (\d+) from (\d+) to (\d+)/
    let cmds = input.split('\r\n')
        .map(x => pattern.exec(x))
        .map(x => ({
            qty: parseInt(x[1]),
            from: parseInt(x[2]) - 1,
            to: parseInt(x[3]) - 1
        }));

    cmds.forEach((cmd, i) => {
        for (let i = 0; i < cmd.qty; i++) {
            let move1 = crates1[cmd.from].pop()
            crates1[cmd.to].push(move1)
        }

        let move2 = crates2[cmd.from].splice(crates2[cmd.from].length - cmd.qty, cmd.qty);
        crates2[cmd.to].push(...move2);
    });

    console.log(`05a: ${crates1.map(x => x[x.length - 1]).join('')}`)
    console.log(`05b: ${crates2.map(x => x[x.length - 1]).join('')}`)
}

function execute() {
    fs.readFile('./day 5/day-5.txt', 'utf8', (err, value) => run(value))
}

export { execute }