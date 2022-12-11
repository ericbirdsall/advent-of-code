const _ = require('underscore');
const fs = require('fs');
let filename = 'input.txt';
if (process.argv[[2]]) {
  filename = 'sample.txt';
}

let text = fs.readFileSync(filename, {encoding:'utf8', flag:'r'});

monkeys = [];


_.chunk(text.split('\n'), 7).forEach(monkeyDesc => {
  let monkey = {};
  console.log(monkeyDesc)
  monkey.items = monkeyDesc[1].replace('  Starting items: ', '').split(', ').map(g => Number(g))
  monkey.operation = monkeyDesc[2].replace('  Operation: new = ', '');
  monkey.testDivisibleBy = Number(monkeyDesc[3].replace('  Test: divisible by ', ''));
  monkey.true = Number(monkeyDesc[4].replace('    If true: throw to monkey ', ''));
  monkey.false = Number(monkeyDesc[5].replace('    If false: throw to monkey ', ''));

  monkey.inspections = 0;
  monkeys.push(monkey);
});

for (let i = 0; i < 20; i++) {
  monkeys.forEach(monkey => {
    let items = monkey.items;
    monkey.items = [];
    items.forEach(item => {
      monkey.inspections += 1;
      let old = item;
      console.log(`monkey inspections item with worry level of ${old}`)
      let newWorryLevel = eval(monkey.operation);
      console.log(`worry level is ${monkey.operation} to ${newWorryLevel}`);
      newWorryLevel = Math.floor(newWorryLevel / 3);
      console.log(`worry level is divided by 3 to ${newWorryLevel}`)
      if (newWorryLevel % monkey.testDivisibleBy === 0) {
        console.log(`${newWorryLevel} is ${monkey.testDivisibleBy}, throwing to monkey ${monkey.true}`);
        monkeys[monkey.true].items.push(newWorryLevel);
      } else {
        console.log(`${newWorryLevel} is not ${monkey.testDivisibleBy}, throwing to monkey ${monkey.false}`);
        monkeys[monkey.false].items.push(newWorryLevel);
      }
    });
  });
  // break;
}

let sorted = monkeys.map(m => m.inspections).sort((a, b) => a - b).reverse();
console.log(sorted);
console.log(sorted[0] * sorted[1]);
