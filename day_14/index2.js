const _ = require('underscore');
const fs = require('fs');
const Jimp = require('jimp');

let filename = 'input.txt';
if (process.argv[[2]]) {
  filename = 'sample.txt';
}

let text = fs.readFileSync(filename, {encoding:'utf8', flag:'r'});

let gridSize = 1000;
let grid = _.range(gridSize).map(() => _.range(gridSize).map(() => '.'));

let maxFloor = -Infinity;
text.split('\n').forEach(path => {
  let coords = path.split(' -> ').map(coord => coord.split(',').map(c => Number(c)));
  for (let i = 0; i < coords.length - 1; i++) {
    let [sCol, sRow] = coords[i];
    let [eCol, eRow] = coords[i + 1];
    for (let rowInc = sRow < eRow ? sRow : eRow; rowInc <= (sRow < eRow ? eRow : sRow); rowInc++) grid[rowInc][sCol] = '#';
    for (let colInc = sCol < eCol ? sCol : eCol; colInc <= (sCol < eCol ? eCol : sCol); colInc++) grid[sRow][colInc] = '#';

    if (sRow > maxFloor) maxFloor = sRow;
    if (eRow > maxFloor) maxFloor = eRow;
  }
});

maxFloor += 2;

function createImage(iter) {
  console.log('writing image');

  let image = new Jimp(grid.length, grid[0].length, function (err, image) {
    if (err) throw err;

    grid.forEach((row, i) => {
      row.forEach((char, j) => {

        if (char === '#') {
          image.setPixelColor(0x398539ff, i, j);
        } else if (char === 'O') {
          image.setPixelColor(0xdbc986ff, i, j);
        } else {
          image.setPixelColor(0xffffffff, i, j);
        }

      });
    });

    iter = '' + iter;
    while (iter.length < 4) iter = '0' + iter;
    image.write(`img_${iter}.png`, (err) => {
      if (err) throw err;
    });
  });
}
// createImage(0);

const sandStart = [500,0];

function isBlocked(row, col) {
  return ['#', 'O'].includes(grid[row][col]) || row === maxFloor;
}

// spawn sand
let sandSpawned = 0, saturated = false;
while (true) {
  let [sandCol, sandRow] = sandStart;

  if (isBlocked(sandRow, sandCol)) {
    break;
  }
  // move sand
  while (true) {
    // sand has fallen off grid
    if (!_.isArray(grid[sandRow + 1])) {
      saturated = true;
      break;
    }
    if (!isBlocked(sandRow + 1, sandCol)) {
      sandRow += 1;
    } else if (!isBlocked(sandRow + 1, sandCol - 1)) {
      sandRow += 1;
      sandCol -= 1;
    } else if (!isBlocked(sandRow + 1, sandCol + 1)) {
      sandRow += 1;
      sandCol += 1;
    } else {
      grid[sandRow][sandCol] = 'O';
      break;
    }
  }
  // createImage(sandSpawned);
  if (saturated) break;
  sandSpawned++;
}

createImage(0);

console.log(sandSpawned);
