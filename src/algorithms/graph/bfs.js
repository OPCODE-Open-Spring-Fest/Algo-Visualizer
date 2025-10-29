/**
 * Builds an adjacency list from the edge array.
 * @param {Array} nodes - Array of node objects.
 * @param {Array} edges - Array of edge objects.
 * @returns {Map<number, number[]>} - An adjacency list.
 */
function buildAdjList(nodes, edges) {
  const adj = new Map();
  nodes.forEach((n) => adj.set(n.id, []));
  edges.forEach((edge) => {
    // This assumes a directed graph
    if (adj.has(edge.from)) {
      adj.get(edge.from).push(edge.to);
    }
  });
  return adj;
}

/**
 * Generates all steps for a Breadth-First Search traversal.
 * @param {Array} nodes - Array of node objects.
 * @param {Array} edges - Array of edge objects.
 * @param {number} startNodeId - The ID of the node to start from.
 * @returns {Array} - An array of step objects for the visualization.
 */
export function bfsSteps(nodes, edges, startNodeId) {
  const adj = buildAdjList(nodes, edges);
  const steps = [];
  const queue = [];
  
  // 'visited' tracks all nodes that have been *at least enqueued*.
  // This prevents adding the same node to the queue multiple times.
  const visited = new Set();
  
  // 'discoveryOrder' tracks nodes *after* they are processed (dequeued).
  // This will control the "green" (visited) state in the UI.
  const discoveryOrder = [];

  // --- Initial Step ---
  queue.push(startNodeId);
  visited.add(startNodeId); // Mark as visited *when enqueuing*
  
  steps.push({
    type: "enqueue",
    node: startNodeId,
    log: `Starting BFS. Enqueueing Start Node ${startNodeId}.`,
    queueState: [...queue],
    visitedSet: new Set(), // Nothing is fully processed yet
    order: [],
  });

  // --- Traversal Loop ---
  while (queue.length > 0) {
    const currentNodeId = queue.shift(); // FIFO: Dequeue from the front
    discoveryOrder.push(currentNodeId);

    // --- Dequeue Step ---
    steps.push({
      type: "dequeue",
      node: currentNodeId,
      log: `Dequeuing Node ${currentNodeId} to process.`,
      queueState: [...queue],
      visitedSet: new Set(discoveryOrder), // Add to processed set
      order: [...discoveryOrder],
    });

    const neighbors = adj.get(currentNodeId) || [];
    
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        // --- Enqueue Neighbor Step ---
        visited.add(neighborId);
        queue.push(neighborId);
        
        steps.push({
          type: "enqueue",
          node: neighborId,
          log: `Found unvisited neighbor ${neighborId}. Enqueueing.`,
          queueState: [...queue],
          visitedSet: new Set(discoveryOrder), // Processed set is unchanged
          order: [...discoveryOrder],
        });
      } else {
        // --- Skip Neighbor Step ---
        steps.push({
          type: "skip",
          node: neighborId,
          log: `Neighbor ${neighborId} already in queue or processed. Skipping.`,
          queueState: [...queue],
          visitedSet: new Set(discoveryOrder),
          order: [...discoveryOrder],
        });
      }
    }
  }

  // --- Final Step ---
  steps.push({
    type: "done",
    node: null,
    log: "BFS complete. Queue is empty.",
    queueState: [],
    visitedSet: new Set(discoveryOrder),
    order: [...discoveryOrder],
  });

  return steps;
}