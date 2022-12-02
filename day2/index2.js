fs = require('fs');

let text = fs.readFileSync('input.txt', {encoding:'utf8', flag:'r'});


let total = 0;
text.split('\n').forEach(line => {
  let opponent = line.substr(0, 1);
  let matchResult = line.substr(2, 1);

  let me = {
    'A': {X: 'Z', Y: 'X', Z: 'Y'},
    'B': {X: 'X', Y: 'Y', Z: 'Z'},
    'C': {X: 'Y', Y: 'Z', Z: 'X'},
  }[opponent][matchResult];

  let score = {
    'A': {X: 1 + 3, Y: 2 + 6, Z: 3 + 0},
    'B': {X: 1 + 0, Y: 2 + 3, Z: 3 + 6},
    'C': {X: 1 + 6, Y: 2 + 0, Z: 3 + 3},
  }[opponent][me];
  total += score;
});

console.log(total);
