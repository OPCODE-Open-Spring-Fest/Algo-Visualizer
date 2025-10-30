export default function runTopologicalSortDFS(nodes, edges) {
  const adjList = {};
  const visited = {};
  const topoOrder = [];
  const steps = [];
  let hasCycle = false;

  // Initialize adjacency list
  nodes.forEach(node => {
    adjList[node] = [];
    visited[node] = 0; // 0 = unvisited, 1 = visiting, 2 = visited
  });

  // Build graph
  edges.forEach(({ from, to }) => {
    adjList[from].push(to);
  });

  function dfs(node) {
    if (hasCycle) return; // stop early if cycle found
    visited[node] = 1;
    steps.push({
      type: "visit",
      node,
      status: "visiting",
      message: `Visiting ${node}`
    });

    for (const neighbor of adjList[node]) {
      if (visited[neighbor] === 0) {
        steps.push({
          type: "exploreEdge",
          from: node,
          to: neighbor,
          message: `Exploring edge ${node} → ${neighbor}`
        });
        dfs(neighbor);
      } else if (visited[neighbor] === 1) {
        // Back edge → cycle detected
        hasCycle = true;
        steps.push({
          type: "cycleDetected",
          from: node,
          to: neighbor,
          message: `Cycle detected via ${node} → ${neighbor}`
        });
      }
    }

    visited[node] = 2;
    topoOrder.push(node);
    steps.push({
      type: "addToTopoOrder",
      node,
      topoOrder: [...topoOrder],
      message: `Added ${node} to topo order`
    });
  }

  // Run DFS for all unvisited nodes
  for (const node of nodes) {
    if (visited[node] === 0) {
      steps.push({
        type: "startDFS",
        node,
        message: `Starting DFS from ${node}`
      });
      dfs(node);
    }
  }

  if (!hasCycle) {
    topoOrder.reverse(); // reverse for correct topological order
    steps.push({
      type: "finalOrder",
      topoOrder: [...topoOrder],
      message: `Topological sort completed successfully`
    });
  } else {
    steps.push({
      type: "finalCycle",
      message: `Topological sort failed — cycle exists in graph`
    });
  }

  return steps;
}
