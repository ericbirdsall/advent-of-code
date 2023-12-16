const _ = require('underscore');
const fs = require('fs');

let filename = 'input.txt';
if (process.argv[[2]]) {
  filename = 'sample.txt';
}

let text = fs.readFileSync(filename, {encoding:'utf8', flag:'r'});

const BAR = [
  [1,1,1,1]
];

const CROSS = [
  [0,1,0],
  [1,1,1],
  [0,1,0],
];
const EL = [
  [0,0,1],
  [0,0,1],
  [1,1,1],
].reverse();

const SPIKE = [
  [1],
  [1],
  [1],
  [1],
];

const BALL = [
  [1,1],
  [1,1],
];

let rocks = [
  BAR, CROSS, EL, SPIKE, BALL,
];

let windDirs = text.split('');

const CAVERN_WIDTH = 7;

let cavern = _.range(1_000).map(() => _.range(CAVERN_WIDTH).map(() => 0));

const NUM_ROCKS = 2022, startCol = 2;

let
  steps = 0,
  highestRow = -1,
  offset = 0,
  floor = 0,
  occupied = _.range(CAVERN_WIDTH).map(() => false)
;

for (let i = 0; i < NUM_ROCKS; i++) {
  let rock = {
    shape: rocks[i % rocks.length],
    row: highestRow + 4,
    col: startCol,
  };

  while (true) {
    let windDir = windDirs[steps % windDirs.length];
    steps++;

    tryWindPush(cavern, rock, windDir, offset);

    let fell = tryGravity(cavern, rock, offset);

    if (!fell) {
      let maxPlacement = placeRock(cavern, rock, offset);
      if (maxPlacement + offset > highestRow) {
        highestRow = maxPlacement + offset;
        occupied = occupied.map((col, i) => col || cavern[maxPlacement][i]);
      }
      break;
    }

  }
  if (occupied.every(x => x)) {
    console.log('Floor', floor);
    // console.log('Offset', offset);
    // console.log('highestRow', highestRow);
    occupied = _.range(CAVERN_WIDTH).map(() => false);
    cavern.splice(0, floor);
    cavern = cavern.concat(_.range(floor).map(() => _.range(CAVERN_WIDTH).map(() => 0)));
    offset += floor;
    floor = highestRow - offset;
  }
  if (i % (NUM_ROCKS / 1000) === 0) {
    console.log((i / NUM_ROCKS).toFixed(2));
  }
}

console.log(highestRow + 1);

function tryWindPush(cavern, rock, windDir, offset) {
  let {shape, row, col} = rock;
  let move = windDir === '<' ? -1 : 1;
  let canShift = true;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[0].length; j++) {
      if (shape[i][j]) {
        let desiredCol = col + j + move;
        // hit wall
        if (desiredCol < 0 || desiredCol > (CAVERN_WIDTH - 1)) {
          canShift = false;
        }
        // if (!cavern[row + i - offset]) console.log(cavern.length, row, i, offset)
        // there is a rock bit here, and an obstruction where we want to move it
        if (cavern[row + i - offset][col + j + move]) {
          canShift = false;
        }
      }
    }
  }

  if (canShift) {
    rock.col += move;
  }
}

function tryGravity(cavern, rock, offset) {
  let {shape, row, col} = rock;

  let canFall = true;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[0].length; j++) {
      // there is a rock bit here, and no free space under it
      if (shape[i][j]) {
        let desiredRow = row + i - 1 - offset;
        if (desiredRow < 0 || cavern[desiredRow][col + j]) {
          canFall = false;
        }
      }
    }
  }
  if (canFall) {
    rock.row -= 1;
  }

  return canFall;
}

function placeRock(cavern, {shape, row, col}, offset) {
  let highestRow = -Infinity;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[0].length; j++) {
      if (shape[i][j]) {
        let placementRow = row + i - offset;
        cavern[placementRow][col + j] = 1;
        if (placementRow > highestRow) highestRow = placementRow;
      }
    }
  }
  return highestRow;
}

function drawCavern() {
  let output = '';
  for (let i = 20; i >= 0; i--) {
    let row = cavern[i].map(p => p ? '#' : '.').join('');
    output += row + '\n';
  }
  console.log('==============');
  console.log(output);
  console.log('==============');
}
