const _ = require('underscore');
const fs = require('fs');

let total = 0;
let text = fs.readFileSync('input.txt', {encoding:'utf8', flag:'r'});

text.split('\n').forEach(line => {
  let [assignmentA, assignmentB] = line.split(',')

  let [aBotEnd, aTopEnd] = assignmentA.split('-');
  let [bBotEnd, bTopEnd] = assignmentB.split('-');

  let aRange = _.range(Number(aBotEnd), Number(aTopEnd) + 1);
  let bRange = _.range(Number(bBotEnd), Number(bTopEnd) + 1);

  let unionSize = _.union(aRange, bRange).length;
  if (unionSize < (aRange.length + bRange.length)) {
    total++;
  }
});

console.log(total);
