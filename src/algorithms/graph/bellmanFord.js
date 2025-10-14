export default function runBellmanFord(nodes, edges, source) {
  const dist = {};
  nodes.forEach(n => dist[n] = Infinity);
  dist[source] = 0;

  const steps = [];

  // Relax edges |V|-1 times
  for (let i = 0; i < nodes.length - 1; i++) {
    for (const edge of edges) {
      const { from, to, weight } = edge;
      const step = {
        type: "relax",
        iteration: i + 1,
        edge,
        prevDistance: dist[to]
      };

      if (dist[from] + weight < dist[to]) {
        dist[to] = dist[from] + weight;
        step.updatedDistance = dist[to];
      }

      steps.push(step);
    }
  }

  // Check for negative weight cycles
  for (const edge of edges) {
    const { from, to, weight } = edge;
    if (dist[from] + weight < dist[to]) {
      steps.push({ type: "negativeCycle", edge });
    }
  }

  return steps;
}
