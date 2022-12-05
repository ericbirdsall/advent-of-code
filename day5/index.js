const _ = require('underscore');
const fs = require('fs');


let text = fs.readFileSync('input.txt', {encoding:'utf8', flag:'r'});
let total = 0;

`
                    [L]     [H] [W]
                [J] [Z] [J] [Q] [Q]
[S]             [M] [C] [T] [F] [B]
[P]     [H]     [B] [D] [G] [B] [P]
[W]     [L] [D] [D] [J] [W] [T] [C]
[N] [T] [R] [T] [T] [T] [M] [M] [G]
[J] [S] [Q] [S] [Z] [W] [P] [G] [D]
[Z] [G] [V] [V] [Q] [M] [L] [N] [R]
 1   2   3   4   5   6   7   8   9
`

let arr = [
  ['ZJNWPS'],
  ['GST'],
  ['VQRLH'],
  ['VSTD'],
  ['QZTDBMJ'],
  ['MWTJDCZL'],
  ['LPMWGTJ'],
  ['NGMTBFQH'],
  ['RDGCPBQW'],
];

arr = arr.map(arr => {
  return arr[0].split('');
});

text.split('\n').forEach(line => {
  let group = line.match(/[\D]*(\d+)[\D]*(\d+)[\D]*(\d+)/);

  let amount = Number(group[1]);
  let startStack = Number(group[2]) - 1;
  let endStack = Number(group[3] - 1);

  _.range(amount).forEach(iter => {
    let val = arr[startStack].pop();
    arr[endStack].push(val);
  });
});

let answer = '';
arr.forEach(val => {
  answer += val.pop();
});

console.log(answer);
