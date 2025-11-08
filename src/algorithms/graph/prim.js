// src/algorithms/graph/prim.js

// Build adjacency list from list of edges
function buildAdjacency(edges, n) {
  const adj = Array.from({ length: n }, () => []);
  for (const e of edges) {
    const u = e.from - 1;
    const v = e.to - 1;
    const w = e.weight;

    adj[u].push({ u, v, w });
    adj[v].push({ u: v, v: u, w }); // undirected graph
  }
  return adj;
}

/**
 * Prim's Algorithm – Step Generator
 * Yields one step at a time:
 *  type: "consider" | "add" | "skip" | "done"
 *  edge: {from, to, weight}
 *  visited: boolean[]
 *  frontier: edge[]
 *  mst: collected MST edges
 */
export function* primSteps(edges, nodeCount, startNode = 1) {
  if (nodeCount === 0) {
    yield { type: "done", mst: [], visited: [], frontier: [] };
    return;
  }

  const adj = buildAdjacency(edges, nodeCount);
  const visited = Array(nodeCount).fill(false);
  const mst = [];
  const frontier = [];

  const pushEdges = (u) => {
    for (const { v, w } of adj[u]) {
      if (!visited[v]) {
        frontier.push({ from: u + 1, to: v + 1, weight: w });
      }
    }
  };

  const startIdx = Math.max(1, Math.min(startNode, nodeCount)) - 1;
  visited[startIdx] = true;
  pushEdges(startIdx);

  while (mst.length < nodeCount - 1 && frontier.length > 0) {
    frontier.sort((a, b) => a.weight - b.weight);
    const edge = frontier.shift();

    yield {
      type: "consider",
      edge,
      visited: [...visited],
      frontier: [...frontier],
      mst: [...mst],
    };

    const u = edge.from - 1;
    const v = edge.to - 1;

    if (visited[u] && visited[v]) {
      yield {
        type: "skip",
        edge,
        visited: [...visited],
        frontier: [...frontier],
        mst: [...mst],
      };
      continue;
    }

    const nextNode = visited[u] ? v : u;
    visited[nextNode] = true;

    mst.push(edge);
    pushEdges(nextNode);

    yield {
      type: "add",
      edge,
      visited: [...visited],
      frontier: [...frontier],
      mst: [...mst],
    };
  }

  yield {
    type: "done",
    mst: [...mst],
    visited: [...visited],
    frontier: [...frontier],
  };
}
