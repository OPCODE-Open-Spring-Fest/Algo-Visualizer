export default function runBellmanFord(nodes, edges, source) {
  const dist = {};
  nodes.forEach(n => dist[n] = Infinity);
  dist[source] = 0;

  const steps = [];

  // Relax edges |V|-1 times
  for (let i = 0; i < nodes.length - 1; i++) {
    let updated = false;
    for (const edge of edges) {
      const from = edge.u ?? edge.from;
      const to = edge.v ?? edge.to;
      const weight = edge.w ?? edge.weight;

      const step = {
        type: "relax",
        iteration: i + 1,
        edge: { u: from, v: to, w: weight },
        prevDistance: dist[to],
      };

      // ✅ Important: Check dist[from] !== Infinity before relaxing
      if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {
        dist[to] = dist[from] + weight;
        step.updatedDistance = dist[to];
        updated = true;
      } else {
        step.type = "skip";
      }

      steps.push(step);
    }

    // Optimization: if no update in this pass, break early
    if (!updated) break;
  }

  // Check for negative weight cycles
  for (const edge of edges) {
    const from = edge.u ?? edge.from;
    const to = edge.v ?? edge.to;
    const weight = edge.w ?? edge.weight;

    if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {
      steps.push({ type: "negative-cycle", edge: { u: from, v: to, w: weight } });
    }
  }

  // Push final state step for visualization
  steps.push({ type: "done", distances: { ...dist } });

  // Return both steps & final distances
  return { steps, distances: dist };
}
