import { readFile } from 'node:fs/promises';;

const cmd = { //command letter -> relative movement mapping
    U: { x: 0, y: 1 },
    D: { x: 0, y: -1 },
    L: { x: -1, y: 0 },
    R: { x: 1, y: 0 },
    N: { x: 0, y: 0 }
};

function moveTo(piece, pos) { //move a given piece to an absolute position
    piece.x = pos.x;
    piece.y = pos.y;
}

function needTailMove(prev, curr) {
    let diff = [prev.x - curr.x, prev.y - curr.y]; //get x pos diff and y pos diff 
    return diff.some(x => Math.abs(x) > 1); //return true if any direction has an absolute (force-positive) diff > 1
}

function getTailPos(prev, curr) { //calculate the position the tail needs to move to to catch up with the previous segment
    return {
        x: prev.x - Math.trunc((prev.x - curr.x) / 2),
        y: prev.y - Math.trunc((prev.y - curr.y) / 2)
    };
}

function doMove(piece, move) { //execute a relative movement
    piece.x += cmd[move.dir].x;
    piece.y += cmd[move.dir].y;
}

function getRope(numTails) {
    let rope = [{ x: 0, y: 0 }]; //head
    for (let n = 0; n < numTails; n++) {
        rope.push({ x: 0, y: 0 }); //each tail
    }
    return rope;
}

function getCommands(input) {
    return input.split('\r\n').map(movePair => { //split by line
        let parts = movePair.split(' '); //split by the space between the parts
        return {
            dir: parts[0], //first part is direction to move
            qty: parseInt(parts[1]) //second part is number of moves
        };
    });
}

function doRope(input, tailSize) {
    const head = 0; //head is segment 0 always
    let commands = getCommands(input); //break down inputs into objects for easier to read code
    let rope = getRope(tailSize); //get a list of positions for the head + number of tail segments
    let tailPositions = {}; //object holding co-ords visited by last tail piece

    commands.forEach(command => {
        for (let moveQty = 1; moveQty <= command.qty; moveQty++) { //loop over quantity of moves for current command
            doMove(rope[head], command); //move head per command

            for (let tail = 1; tail <= tailSize; tail++) { //loop over non-head segments
                let prev = tail - 1; //set ref to previous segment

                if (needTailMove(rope[prev], rope[tail])) { //if current tail segment is too far away from previous (>1 tile in any direction)
                    moveTo(rope[tail], getTailPos(rope[prev], rope[tail])); //get the new position this segment should move to, and execute the move
                }

                if (tail == tailSize) { //record last tail segment position
                    tailPositions[`${rope[tail].x},${rope[tail].y}`] = true;
                }
            }
        }
    });

    return Object.keys(tailPositions).length; //get count of unique positions recorded
}

function run(input) {
    let result1, result2;

    result1 = doRope(input, 1); //1 tail piece
    result2 = doRope(input, 9); //9 tail pieces

    console.log(`09a: ${result1}`);
    console.log(`09b: ${result2}`);
}

function execute() {
    readFile('./2022/day9/day9.txt').then(value => run(value.toString()));
}

export default { execute }