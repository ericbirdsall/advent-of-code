const _ = require('underscore');
const fs = require('fs');

let text = fs.readFileSync('input.txt', {encoding:'utf8', flag:'r'});

function coordinatesAdjacent(coordA, coordB) {
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (!(i === 0 && j === 0)) {
        let adjacent = (coordA.x === coordB.x + i) && (coordA.y === coordB.y + j);
        if (adjacent) return true;
      }
    }
  }
  return false;
}

function moveCoordinate(coord, direction, steps) {
  switch(direction) {
    case 'R':
      coord.x += steps;
      break;
    case 'L':
      coord.x -= steps;
      break;
    case 'U':
      coord.y += steps;
      break;
    case 'D':
      coord.y -= steps;
      break;
    default:
      throw new Error();
  }
}

function moveTail(tail, head) {
  if (tail.x === head.x) {
    if (tail.y > head.y) {
      tail.y -= 1;
    } else if (tail.y < head.y) {
      tail.y += 1;
    }
  } else if (tail.y === head.y) {
    if (tail.x > head.x) {
      tail.x -= 1;
    } else if (tail.x < head.x) {
      tail.x += 1;
    }
  } else {
    if (tail.x > head.x) {
      tail.x -= 1;
    } else {
      tail.x += 1;
    }

    if (tail.y > head.y) {
      tail.y -= 1;
    } else {
      tail.y += 1;
    }
  }

}

let knots = _.range(10).map(i => ({x: 0, y: 0}));

let tailLocations = new Set();
tailLocations.add(JSON.stringify(knots[knots.length - 1]));

text.split('\n').forEach(line => {
  let [direction, steps] = line.split(' ');
  steps = Number(steps);

  for (let i = 0; i < steps; i++) {
    moveCoordinate(knots[0], direction, 1);

    for (let j = 0; j < knots.length - 1; j++) {
      if (!coordinatesAdjacent(knots[j], knots[j + 1])) {
        moveTail(knots[j + 1], knots[j]);
      }
    }

    tailLocations.add(JSON.stringify(knots[knots.length - 1]));
  }
});

console.log(tailLocations.size);