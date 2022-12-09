const _ = require('underscore');
const fs = require('fs');

let text = fs.readFileSync('input.txt', {encoding:'utf8', flag:'r'});
let total = 0;

function rotate(matrix) {
  return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse())
}

function logTable(grid) {
  let str = grid.map(row => row.map(item => item ? '0' : '.').join('')).join('\n');
  console.log(str);
}

let grid = [];
text.split('\n').forEach(line => {
  grid.push(line.split('').map(i => Number(i)));
});

let viewableTrees = 0;

let counted = _.range(grid.length).map(g => _.range(grid[0].length).map(g => false));

_.range(4).forEach(side => {
  grid = rotate(grid);
  counted = rotate(counted);

  for (let i = 1; i < grid.length - 1; i++) {
    let lane = grid[i];
    let tallestTreeSeen = -Infinity;
    lane.forEach((treeHeight, j) => {
      if (treeHeight > tallestTreeSeen) {
        if (!counted[i][j]) {
          viewableTrees++;
          counted[i][j] = true;
        }
        tallestTreeSeen = treeHeight;
      }
    });
  }
});

logTable(counted);
console.log(viewableTrees + 4);
