const _ = require('underscore');
const fs = require('fs');
let filename = 'input.txt';
if (process.argv[[2]]) {
  filename = 'sample.txt';
}

let text = fs.readFileSync(filename, {encoding:'utf8', flag:'r'});

let monkeys = [];

_.chunk(text.split('\n'), 7).forEach(monkeyDesc => {
  let monkey = {};
  monkey.items = monkeyDesc[1].replace('  Starting items: ', '').split(', ').map(g => Number(g))
  monkey.operation = monkeyDesc[2].replace('  Operation: new = ', '');
  monkey.testDivisibleBy = Number(monkeyDesc[3].replace('  Test: divisible by ', ''));
  monkey.true = Number(monkeyDesc[4].replace('    If true: throw to monkey ', ''));
  monkey.false = Number(monkeyDesc[5].replace('    If false: throw to monkey ', ''));

  monkey.inspections = 0;
  monkeys.push(monkey);
});

let divisors = monkeys.map(m => m.testDivisibleBy);
let all = divisors.reduce((a, b) => a * b, 1);

for (let i = 0; i < 10000; i++) {
  monkeys.forEach(monkey => {
    let items = monkey.items;
    monkey.items = [];
    items.forEach(item => {
      let old = item % all;
      let newWorryLevel = eval(monkey.operation);

      if (newWorryLevel % monkey.testDivisibleBy === 0) {
        monkeys[monkey.true].items.push(newWorryLevel);
      } else {
        monkeys[monkey.false].items.push(newWorryLevel);
      }
      monkey.inspections += 1;
    });
  });
}

let sorted = monkeys.map(m => m.inspections).sort((a, b) => a - b).reverse();
console.log(sorted[0] * sorted[1]);
