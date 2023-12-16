const _ = require('underscore');
const fs = require('fs');
const PriorityQueue = require('js-priority-queue');
let filename = 'input.txt';
if (process.argv[[2]]) {
  filename = 'sample.txt';
}

let text = fs.readFileSync(filename, {encoding:'utf8', flag:'r'});


let valves = {}, start = null;
text.split('\n').forEach(line => {
  console.log(line)
  let [, valve, flowRate, valvePaths] = line.match(/Valve ([\w]*) has flow rate=([\d]*).*to valve[s]? (.*)/);
  flowRate = Number(flowRate);
  valvePaths = valvePaths.split(', ');

  if (!start) start = valve;

  console.log(valve);
  valves[valve] = {
    flowRate,
    tunnels: valvePaths,
  };
});


let queue = new PriorityQueue({ comparator: function(jobA, jobB) { return jobA[1] - jobB[1]; }});


let start, end;

let nodes = {};


function nodeForCoords(i, j) {
  return nodes[JSON.stringify({i, j})];
}

function keyForNode(node) {
  return JSON.stringify({i: node.i, j: node.j});
}

function findPathWithDijkstra(start, end) {
  let steps = {};
  let backtrace = {};

  steps[keyForNode(start)] = 0;

  Object.values(nodes).forEach(node => {
    if (node !== start) {
      steps[keyForNode(node)] = Infinity;
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

      let newSteps = steps[keyForNode(currentNode)] + 1;

      if (newSteps < steps[keyForNode(adjacentNode)]) {
        steps[keyForNode(adjacentNode)] = newSteps;
        backtrace[keyForNode(adjacentNode)] = currentNode;
        queue.queue([adjacentNode, newSteps]);
      }
    });
  }

  console.log(steps[keyForNode(end)]);
}

findPathWithDijkstra(start, end)
