const _ = require('underscore');
const fs = require('fs');

let total = 0;
let text = fs.readFileSync('input.txt', {encoding:'utf8', flag:'r'});

text.split('\n').forEach(rucksack => {
  let a = rucksack.substr(0, rucksack.length / 2);
  let b = rucksack.substr(rucksack.length / 2, rucksack.length / 2);

  let set = _.intersection(a.split(''), b.split(''));

  set.forEach(item => {
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
