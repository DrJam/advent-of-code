import { readFile } from 'node:fs/promises';

function getV(cmd) { return parseInt(cmd.split(' ')[1]); }

function run(input) {
    let result1, result2;

    let commands = input.split('\r\n');

    let x = 1;
    let results = [];
    let info = [];
    let ptr = 0;
    let cmd = '';
    let wait = false;
    let ready = true;
    const maxTick = 240
    const checkTicks = [20, 60, 100, 140, 180, 220];
    let line = '';
    let lines = [];

    for (let tick = 1; tick <= maxTick; tick++) {
        if (ready && ptr < commands.length) {
            cmd = commands[ptr]
            ready = false;
            wait = cmd.startsWith('addx');
        }

        if (checkTicks.some(check => check == tick)) {
            results.push(x * tick);
            info.push(`${tick} * ${x}`);
        }

        let tracerPos = ((tick - 1) % 40);
        if (tracerPos == 0) line = '';
        if (tracerPos >= x - 1 && tracerPos <= x + 1) {
            line += '█';
        } else {
            line += ' ';
        }
        if (tracerPos == 39) {
            lines.push(line)
        }


        if (!ready) {
            if (wait) {
                wait = false;
            } else {
                if (cmd.startsWith('addx')) {
                    x += getV(cmd);
                }

                ptr += 1;
                ready = true;
            }
        }
    }

    result1 = results.reduce((p, c) => p + c, 0);
    console.log(`10a: ${result1}`);
    console.log(`10b:`);
    lines.forEach(line => console.log(line))
}

function execute() {
    readFile('./day10/day10.txt').then(value => run(value.toString()));
}

export default { execute }