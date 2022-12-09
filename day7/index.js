const _ = require('underscore');
const fs = require('fs');
const path = require('path');

let text = fs.readFileSync('input.txt', {encoding:'utf8', flag:'r'});
let total = 0;


let currPath = '/';

let santaFS = {};

text.split('\n').forEach(line => {
  let cmds = line.split(' ');
  if (cmds[0] == '$') {
    if (cmds[1] == 'cd') {
      if (cmds[2] == '..') {
        currPath = path.dirname(currPath)
      } else {
        currPath = path.join(currPath, cmds[2]);
      }
    } else if (cmds[1] == 'ls') {
      // do nothing
    }
  } else {
    if (cmds[0] == 'dir') {
      let folderName = cmds[1];
      santaFS[path.join(currPath, folderName)] = 'dir';
    } else {
      let [fileSize, fileName] = cmds;
      santaFS[path.join(currPath, fileName)] = Number(fileSize);
    }
  };
});

let sum = 0;
Object.keys(santaFS).forEach(key => {
  if (santaFS[key] == 'dir') {
    let sizes = Object.keys(santaFS).map(smallkey => {
      if (smallkey.startsWith(key + '/') && santaFS[smallkey] !== 'dir') {
        return santaFS[smallkey];
      }
      return 0;
    });

    let size = sizes.reduce((a, b) => a + b, 0);
    if (size <= 100000) {
      sum += size;
    }
  }
});

console.log(sum);
