const fs = require('fs');

fs.readFile('./day-1.txt', 'utf8', (err, value) => {
    day1(value);
})

function day1(input) {
    //split input string by double newline
    let base = input.split('\r\n\r\n');

    //break up line groups into single lines then convert lines to numbers
    let ints = base.map(str => str.split('\r\n').map(x => parseInt(x)));

    //for each group of lines, sum the numbers. store the list of sums in desc order
    let sums = ints.map(elf => elf.reduce((p, c) => p + c, 0)).sort((a, b) => b - a);

    //list the first sum
    console.log(sums[0])

    //take the top 3 sums and sum them
    console.log(sums.slice(0, 3).reduce((p, c) => p + c, 0))
}