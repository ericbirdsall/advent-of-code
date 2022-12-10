const _ = require('underscore');
const fs = require('fs');

let text = fs.readFileSync('input.txt', {encoding:'utf8', flag:'r'});

let EOLs = _.range(6).map(i => ((i + 1) * 40));
let registerVal = 1;
let cycle = 1;
let msg = '';

function checkCycle() {
  let sprite = _.range(3).map(i => (registerVal - 1 + i));

  if (sprite.includes((cycle - 1) % 40)) {
    msg += '#'
  } else {
    msg += '.'
  }
  if (EOLs.includes(cycle)) msg += '\n';
};

text.split('\n').forEach(line => {
  let [instruction, integer] = line.split(' ');
  integer = Number(integer);

  if (instruction === 'noop') {
    checkCycle();
    cycle += 1;
  }
  if (instruction === 'addx') {
    checkCycle()
    cycle += 1;
    checkCycle()
    cycle += 1;
    registerVal += integer;
  }
});

console.log(msg)