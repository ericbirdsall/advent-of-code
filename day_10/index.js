const _ = require('underscore');
const fs = require('fs');

let text = fs.readFileSync('input.txt', {encoding:'utf8', flag:'r'});


let cycles = _.range(6).map(i => 20 + (i * 40));

let registerVal = 1;
let cycle = 1;
let strength = 1;

let accum = 0;
function checkCycle() {
  if (cycles.includes(cycle)) {
    let sigStrength = cycle * registerVal;
    accum += sigStrength;
  }
};

text.split('\n').forEach(line => {
  let [instruction, integer] = line.split(' ');
  integer = Number(integer);

  if (instruction === 'noop') {
    cycle += 1;
    checkCycle();
  }
  if (instruction === 'addx') {
    cycle += 1;
    checkCycle()
    cycle += 1;
    registerVal += integer;
    checkCycle()
  }
});

console.log(accum);
