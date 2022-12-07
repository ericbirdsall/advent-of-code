const _ = require('underscore');
const fs = require('fs');


let text = fs.readFileSync('sample.txt', {encoding:'utf8', flag:'r'});
let total = 0;


currPath = ''

let santaFS = {};

text.split('\n').forEach(line => {
  let cmds = line.split(' ');
  if (cmds[0] == '$') {
    if (cmds[1] == 'cd') {
      if (cmds[2] == '..') {
        let newPath = currPath.split('/');
        newPath.pop();
        currPath = newPath.join('/');
      } else {
        if (currPath == '' || cmds[2] == '/') {
          currPath = '/';
        } else {
          currPath = currPath + '/' + cmds[2];
        }

      }
    } else if (cmds[1] == 'ls') {
      // do nothing
    }
  } else {
    if (cmds[0] == 'dir') {
      let folderName = cmds[1];
      santaFS[currPath + '/' + folderName] = 'dir';
    } else {
      let fileSize = cmds[0];
      let fileName = cmds[1];
      santaFS[currPath + '/' + fileName] = fileSize;
    }
  };
});



let newSantaFS = santaFS;
// Object.keys(santaFS).forEach(key => {
//   newSantaFS[key.substr(2, Infinity)] = santaFS[key];
// });

// console.log(JSON.stringify(newSantaFS, null, 2));

let sum = {};
let sum2 = 0;
Object.keys(newSantaFS).forEach(key => {
  console.log(key)
  if (newSantaFS[key] == 'dir') {
    let sizes = Object.keys(newSantaFS).map(smallkey => {
      if (smallkey.startsWith(key) && !_.isNaN(+newSantaFS[smallkey])) return +newSantaFS[smallkey];
      return 0;
    });

    let size = sizes.reduce((a, b) => a + b, 0);
    if (size <= 100000) {
      sum[key] = size;
      sum2 += size;
    }
    // console.log(`size of ${key}: ${size}`)
  }
});

console.log(sum);
console.log(sum2)