const _ = require('underscore');
const fs = require('fs');


let text = fs.readFileSync('input.txt', {encoding:'utf8', flag:'r'});

let markerSize = 14;

for (let i = 0; i < text.length - markerSize; i++) {
  let set = new Set(_.range(markerSize).map(j => text[i + j]));
  if (set.size === markerSize) {

    console.log(i + markerSize);
    break;
  }
}
