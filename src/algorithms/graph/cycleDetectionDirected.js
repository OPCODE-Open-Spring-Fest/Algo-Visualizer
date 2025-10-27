// src/algorithms/graph/cycleDetectionDirected.js

export function* detectCycleDirected(graph) {
  const { nodes, edges } = graph;
  const visited = {};
  const recStack = {};

  const adj = {};
  nodes.forEach((n) => (adj[n] = []));
  edges.forEach((e) => adj[e.u].push(e.v));

  const dfs = function* (node, parent) {
    visited[node] = true;
    recStack[node] = true;
    yield { type: "visit", node };

    for (const neighbor of adj[node]) {
      yield { type: "explore", from: node, to: neighbor };

      if (!visited[neighbor]) {
        yield* dfs(neighbor, node);
      } else if (recStack[neighbor]) {
        yield { type: "cycle-found", edge: { u: node, v: neighbor } };
      }
    }

    recStack[node] = false;
  };

  for (const node of nodes) {
    if (!visited[node]) {
      yield* dfs(node, null);
    }
  }

  yield { type: "done" };
}
