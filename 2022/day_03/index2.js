const _ = require('underscore');
const fs = require('fs');

let total = 0;
let text = fs.readFileSync('input.txt', {encoding:'utf8', flag:'r'});

_.chunk(text.split('\n'), 3).forEach(group => {
  let badge = _.intersection(...group)

  badge.forEach(item => {
    let score = NaN;
    if (item.toUpperCase() == item) {
      score = item.charCodeAt(0) - 38;
    } else {
      score = item.charCodeAt(0) - 96;
    }
    total += score;
  })
});

console.log(total);
