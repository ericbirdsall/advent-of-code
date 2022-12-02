fs = require('fs');

let text = fs.readFileSync('input.txt', {encoding:'utf8', flag:'r'});

let max = []
let currentCount = 0;
text.split('\n').forEach(line => {
  let num = Number(line);
  if (num === 0) {
    max.push(currentCount);
    currentCount = 0;
  }
  currentCount += num;
});

max = max.sort((a, b) => a - b).reverse();
console.log(max)
console.log(max[0] + max[1] + max[2]);

