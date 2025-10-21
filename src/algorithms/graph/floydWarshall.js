// src/algorithms/graph/floydWarshall.js

// 🧠 Generator that yields every visualization step
export function* floydWarshallSteps(edges, nodeCount) {
  // Initialize distance matrix with Infinity
  const dist = Array.from({ length: nodeCount }, () =>
    Array(nodeCount).fill(Infinity)
  );

  // Distance from a node to itself is 0
  for (let i = 0; i < nodeCount; i++) {
    dist[i][i] = 0;
  }

  // Set initial distances from edges (use minimum weight for each pair)
  for (let edge of edges) {
    const from = edge.from - 1;
    const to = edge.to - 1;
    if (edge.weight < dist[from][to]) {
      dist[from][to] = edge.weight;
    }
    // For undirected graphs, uncomment the next line
    // if (edge.weight < dist[to][from]) dist[to][from] = edge.weight;
  }

  yield {
    type: "init",
    dist: dist.map((row) => [...row]),
    message: "Initial distance matrix created",
  };

  // Floyd-Warshall algorithm
  for (let k = 0; k < nodeCount; k++) {
    yield {
      type: "intermediate",
      k,
      dist: dist.map((row) => [...row]),
      message: `Using node ${k + 1} as intermediate`,
    };

    for (let i = 0; i < nodeCount; i++) {
      for (let j = 0; j < nodeCount; j++) {
        if (i === j) continue;

        const oldDist = dist[i][j];
        const newDist = dist[i][k] + dist[k][j];

        if (newDist < oldDist) {
          dist[i][j] = newDist;
          yield {
            type: "update",
            k,
            i,
            j,
            oldDist,
            newDist,
            dist: dist.map((row) => [...row]),
            message: `Updated dist[${i + 1}][${j + 1}] from ${
              oldDist === Infinity ? "∞" : oldDist
            } to ${newDist}`,
          };
        } else {
          yield {
            type: "compare",
            k,
            i,
            j,
            oldDist,
            newDist,
            dist: dist.map((row) => [...row]),
            message: `No update: dist[${i + 1}][${j + 1}] = ${
              oldDist === Infinity ? "∞" : oldDist
            } ≤ ${newDist === Infinity ? "∞" : newDist}`,
          };
        }
      }
    }
  }

  // Check for negative cycles
  let hasNegativeCycle = false;
  for (let i = 0; i < nodeCount; i++) {
    if (dist[i][i] < 0) {
      hasNegativeCycle = true;
      break;
    }
  }

  yield {
    type: "done",
    dist: dist.map((row) => [...row]),
    hasNegativeCycle,
    message: hasNegativeCycle
      ? "Algorithm complete - Negative cycle detected!"
      : "Algorithm complete - All shortest paths found",
  };
}

// Helper function to get shortest path between two nodes
export function getShortestPath(dist, predecessor, start, end) {
  if (dist[start][end] === Infinity) {
    return null; // No path exists
  }

  const path = [];
  let current = start;
  path.push(current);

  while (current !== end) {
    current = predecessor[current][end];
    if (current === undefined || current === null) break;
    path.push(current);
  }

  return path.length > 1 && path[path.length - 1] === end ? path : null;
}

// Helper function to format distance matrix for display
export function formatDistanceMatrix(dist) {
  return dist.map((row) =>
    row.map((val) => (val === Infinity ? "∞" : val.toString()))
  );
}
