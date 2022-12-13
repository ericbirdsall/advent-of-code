const _ = require('underscore');
const fs = require('fs');

let filename = 'input.txt';
if (process.argv[[2]]) {
  filename = 'sample.txt';
}

let text = fs.readFileSync(filename, {encoding:'utf8', flag:'r'});

function compare(left, right) {
  if (!_.isArray(left) || !_.isArray(right)) {
    throw new Error('non-array passed to compare');
  }

  let passes = null;
  for (let i = 0; i < (left.length > right.length ? left.length : right.length); i++) {
    let leftItem = left[i];
    let rightItem = right[i];

    if (_.isUndefined(leftItem) && !_.isUndefined(rightItem)) {
      passes = true;
      break;
    } else if (!_.isUndefined(leftItem) && _.isUndefined(rightItem)) {
      passes = false;
      break;
    } else if (_.isNumber(leftItem) && _.isNumber(rightItem)) {
      if (leftItem < rightItem) {
        passes = true;
        break;
      } else if (leftItem > rightItem) {
        passes = false;
        break;
      }
    } else if (_.isNumber(leftItem) && _.isArray(rightItem)) {
      passes = compare([leftItem], rightItem);
      if (passes !== null) break;
    } else if (_.isArray(leftItem) && _.isNumber(rightItem)) {
      passes = compare(leftItem, [rightItem]);
      if (passes !== null) break;
    } else if (_.isArray(leftItem) && _.isArray(rightItem)) {
      passes = compare(leftItem, rightItem);
      if (passes !== null) break;
    }
  }

  return passes;
}

let packets = [];
text.split('\n\n').forEach((packetPair, index) => {
  let [left, right] = packetPair.split('\n')

  packets.push(eval(left));
  packets.push(eval(right));
});

let div1 = [[2]];
let div2 = [[6]]
packets.push(div1);
packets.push(div2);

packets = packets.sort((arr1, arr2) => compare(arr1, arr2) ? -1 : 1);

console.log((packets.findIndex(a => a === div1) + 1) * (packets.findIndex(a => a === div2) + 1));
