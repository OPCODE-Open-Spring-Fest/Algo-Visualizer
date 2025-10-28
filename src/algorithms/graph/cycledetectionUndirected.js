// src/algorithms/graph/cycleDetectionUndirected.js

export function* detectCycleUndirected(graph) {
  const { nodes, edges } = graph;
  const visited = {};

  const adj = {};
  nodes.forEach((n) => (adj[n] = []));
  edges.forEach((e) => {
    adj[e.u].push(e.v);
    adj[e.v].push(e.u);
  });

  const dfs = function* (node, parent) {
    visited[node] = true;
    yield { type: "visit", node };

    for (const neighbor of adj[node]) {
      yield { type: "explore", from: node, to: neighbor };

      if (!visited[neighbor]) {
        yield* dfs(neighbor, node);
      } else if (neighbor !== parent) {
        yield { type: "cycle-found", edge: { u: node, v: neighbor } };
      }
    }
  };

  for (const node of nodes) {
    if (!visited[node]) {
      yield* dfs(node, null);
    }
  }

  yield { type: "done" };
}
