const _ = require('underscore');
const fs = require('fs');

let text = fs.readFileSync('input.txt', {encoding:'utf8', flag:'r'});
let total = 0;


let grid = [];
text.split('\n').forEach(line => {
  grid.push(line.split('').map(i => Number(i)));
});

function calculateScore(grid, i, j) {
  let currentHeight = grid[i][j];

  let northScore = eastScore = southScore = westScore = 0;
  // west
  for (let k = 1; k <= j; k++) {
    westScore++;
    if (grid[i][j - k] >= currentHeight) {
      break;
    }
  }
  // east
  for (let k = 1; k < grid[0].length - j; k++) {
    eastScore++;
    if (grid[i][j + k] >= currentHeight) {
      break;
    }
  }
  // north
  for (let k = 1; k <= i; k++) {
    northScore++;
    if (grid[i - k][j] >= currentHeight) {
      break;
    }
  }
  // south
  for (let k = 1; k < grid.length - i; k++) {
    southScore++;
    if (grid[i + k][j] >= currentHeight) {
      break;
    }
  }

  return northScore * eastScore * southScore * westScore;
}

let highestScore = -Infinity;
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[0].length; j++) {
    let score = calculateScore(grid, i, j);
    // break;
    if (score > highestScore) {
      highestScore = score;
    }
  }
}

console.log(highestScore);
