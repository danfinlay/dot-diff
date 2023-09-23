#!/usr/bin/env node

const fs = require('fs');
const graphviz = require('graphviz');

// Check command line arguments
if (process.argv.length !== 4) {
  console.error('Usage: node diff.js <file1.dot> <file2.dot>');
  process.exit(1);
}

// Parse the .DOT files
const dotFile1 = fs.readFileSync(process.argv[2], 'utf8');
const dotFile2 = fs.readFileSync(process.argv[3], 'utf8');

const graph1 = graphviz.parse(dotFile1);
const graph2 = graphviz.parse(dotFile2);

// Compare the graphs and generate a diff graph
const diffGraph = graphviz.digraph('G');

graph1.nodes().forEach(node => {
  if (!graph2.getNode(node.id)) {
    // Node was removed
    const diffNode = diffGraph.addNode(node.id);
    diffNode.set('color', 'red');
  }
});

graph2.nodes().forEach(node => {
  if (!graph1.getNode(node.id)) {
    // Node was added
    const diffNode = diffGraph.addNode(node.id);
    diffNode.set('color', 'green');
  }
});

// TODO: Compare edges and attributes

// Write the diff graph to a .DOT file
fs.writeFileSync('diff.dot', diffGraph.to_dot());
