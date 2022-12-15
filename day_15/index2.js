const _ = require('underscore');
const fs = require('fs');

let filename = 'input.txt';
if (process.argv[[2]]) {
  filename = 'sample.txt';
}

let text = fs.readFileSync(filename, {encoding:'utf8', flag:'r'});

function getDistance(x,y, i, j) {
  return Math.abs(x - i) + Math.abs(y - j);
}

let sensorBeaconPairs = [];
text.split('\n').forEach(line => {
  let [n, sensorX, sensorY, beaconX, beaconY] = line.match(/.*x=([-]?\d*), y=([-]?\d*).*x=([-]?\d*).*y=([-]?\d*)/);


  sensorBeaconPairs.push({
    sensorX: Number(sensorX),
    sensorY: Number(sensorY),
    beaconX: Number(beaconX),
    beaconY: Number(beaconY),
  });
});

const FLOOR = 0, CEIL = 4_000_000;

function countRanges(ranges) {
  let count = 0;
  ranges = ranges.sort((a, b) => a[0] - b[0]);

  for (let i = 0; i < ranges.length; i++) {
    let start = ranges[i];
    if (start[1] < start[0]) {
      start[1] = start[0];
    }
    count += (start[1] - start[0]);

    let next = ranges[i + 1];

    if (next && next[0] < start[1]) next[0] = start[1];
  }

  return count;
}

for (let rowIndex = 0; rowIndex <= CEIL; rowIndex++) {
  let occludedRanges = [];

  sensorBeaconPairs.forEach(({sensorX, sensorY, beaconX, beaconY}) => {
    let occlusionDistance = getDistance(sensorX, sensorY, beaconX, beaconY);

    let rangeOcclusion = occlusionDistance - (Math.abs(sensorY - rowIndex));

    if (rangeOcclusion >= 0) {
      let left = sensorX - rangeOcclusion;
      let right = sensorX + rangeOcclusion;

      occludedRanges.push([left, right]);
    }
  });

  // filter ranges outside search area
  occludedRanges = occludedRanges.filter(range => {
    return range[1] > FLOOR && range[0] < CEIL;
  });

  // clamp ranges to search area
  occludedRanges.forEach(range => {
    if (range[0] < FLOOR) range[0] = FLOOR;
    if (range[1] > CEIL) range[1] = CEIL;
  });

  let count = countRanges(occludedRanges);

  if (count < CEIL) {
    // we have found a row where a beacon **can be**
    // find the unoccluded index in this range (x)
    let counts = _.range(CEIL + 1).map(i => true);
    occludedRanges.forEach(([i, j]) => {
      for (;i <= j; i++) {
        counts[i] = false;
      }
    });

    let x = counts.findIndex(i => i);
    console.log(x * CEIL + rowIndex);
    break;
  }
}