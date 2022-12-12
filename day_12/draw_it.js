const _ = require('underscore');
const fs = require('fs');
const PriorityQueue = require('js-priority-queue');

let filename = 'input.txt';
if (process.argv[[2]]) {
  filename = 'sample.txt';
}

let text = fs.readFileSync(filename, {encoding:'utf8', flag:'r'});

let queue = new PriorityQueue({ comparator: function(jobA, jobB) { return jobA[1] - jobB[1]; }});

let grid = [];
text.split('\n').forEach(line => {
  grid.push(line.split(''));
});

let start, end;

let nodes = {};
for (let i = 0; i < grid.length; i ++) {
  for (let j = 0; j < grid[0].length; j++) {
    let node = {
      i,
      j,
      elevation: grid[i][j].charCodeAt(0),
    };

    if (grid[i][j] === 'S') {
      start = node;
      start.elevation = 'a'.charCodeAt(0)
    } else if (grid[i][j] === 'E') {
      end = node;
      end.elevation = 'z'.charCodeAt(0)
    }
    nodes[JSON.stringify({i, j})] = node;
  }
}

function nodeForCoords(i, j) {
  return nodes[JSON.stringify({i, j})];
}

function keyForNode(node) {
  return JSON.stringify({i: node.i, j: node.j});
}

function findPathWithDijkstra(start, end) {
  let times = {};
  let backtrace = {};

  times[keyForNode(start)] = 0;

  Object.values(nodes).forEach(node => {
    if (node !== start) {
      times[keyForNode(node)] = Infinity;
    }
  });

  queue.queue([start, 0])

  while (queue.length !== 0) {
    let shortestStep = queue.dequeue();
    let currentNode = shortestStep[0];
    [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ].forEach(([i, j]) => {
      let adjacentNode = nodeForCoords(currentNode.i + i, currentNode.j + j);
      // out of bounds
      if (!adjacentNode) {
        return;
      }
      // too high (no edge)
      if (currentNode.elevation + 1 < adjacentNode.elevation) {
        return;
      }

      let time = times[keyForNode(currentNode)] + 1;

      if (time < times[keyForNode(adjacentNode)]) {
        times[keyForNode(adjacentNode)] = time;
        backtrace[keyForNode(adjacentNode)] = currentNode;
        queue.queue([adjacentNode, time]);
      }
    });
  }

  console.log(times[keyForNode(end)]);

  let path = [end];
  let lastStep = end;
  while(lastStep !== start) {
    path.unshift(backtrace[keyForNode(lastStep)])
    lastStep = backtrace[keyForNode(lastStep)]
  }

  const Jimp = require('jimp');

  for (let k = 0; k < path.length; k+=6) {
    let image = new Jimp(grid.length, grid[0].length, function (err, image) {
      if (err) throw err;

      grid.forEach((row, i) => {
        row.forEach((char, j) => {
          if (path.slice(0, k).some(p => p.i == i && p.j == j)) {
            image.setPixelColor(0xdbc986ff, i, j);
          } else {
            image.setPixelColor(0x398539ff, i, j);
          }

        });
      });
      let seq = ''+ k;
      while (seq.length < 3) seq = '0' + seq;
      image.write(`img_${seq}.png`, (err) => {
        if (err) throw err;
      });

      // in same dir, run:
      // convert -delay 0 -loop 1 *.png -rotate 270 -scale 800% the_path.gif
    });
  }
}

findPathWithDijkstra(start, end)
