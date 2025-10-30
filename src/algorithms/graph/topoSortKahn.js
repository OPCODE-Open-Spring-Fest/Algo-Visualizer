export default function runTopologicalSort(nodes, edges) {
  const inDegree = {};
  const adjList = {};

  // Initialize in-degree and adjacency list
  nodes.forEach(node => {
    inDegree[node] = 0;
    adjList[node] = [];
  });

  // Build graph
  edges.forEach(({ from, to }) => {
    adjList[from].push(to);
    inDegree[to]++;
  });

  const steps = [];
  const queue = [];
  const topoOrder = [];

  // Enqueue nodes with 0 in-degree
  for (const node of nodes) {
    if (inDegree[node] === 0) {
      queue.push(node);
      steps.push({
        type: "enqueue",
        node,
        reason: "in-degree 0"
      });
    }
  }

  // Process nodes
  while (queue.length > 0) {
    const current = queue.shift();
    topoOrder.push(current);

    steps.push({
      type: "visit",
      node: current,
      topoOrder: [...topoOrder]
    });

    for (const neighbor of adjList[current]) {
      inDegree[neighbor]--;
      steps.push({
        type: "decrementInDegree",
        from: current,
        to: neighbor,
        newInDegree: inDegree[neighbor]
      });

      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
        steps.push({
          type: "enqueue",
          node: neighbor,
          reason: "in-degree became 0"
        });
      }
    }
  }

  // Check for cycles (if topoOrder doesn't include all nodes)
  if (topoOrder.length !== nodes.length) {
    steps.push({
      type: "cycleDetected",
      remainingNodes: nodes.filter(n => !topoOrder.includes(n))
    });
  }

  return steps;
}
