import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import TopoGraph from "../../components/graph/TopoSortDFSVisualizer";

// Topological Sort using DFS (with generator for step-by-step visualization)
function* dfsTopologicalSort(nodes, edges) {
  const adjList = {};
  const visited = {};
  const topoStack = [];
  const recursionStack = {};

  // Build adjacency list
  nodes.forEach((n) => {
    adjList[n] = [];
    visited[n] = false;
    recursionStack[n] = false;
  });
  edges.forEach(({ u, v }) => adjList[u].push(v));

  // Recursive DFS function
  function* dfs(node) {
    visited[node] = true;
    recursionStack[node] = true;
    yield {
      type: "visit",
      node,
      topoStack: [...topoStack],
      visited: { ...visited },
      recursionStack: { ...recursionStack },
    };

    for (const neighbor of adjList[node]) {
      if (!visited[neighbor]) {
        yield { type: "explore", from: node, to: neighbor };
        yield* dfs(neighbor);
      } else if (recursionStack[neighbor]) {
        yield {
          type: "cycle",
          from: node,
          to: neighbor,
          message: "Cycle detected — topological sort not possible!",
        };
        return;
      }
    }

    recursionStack[node] = false;
    topoStack.push(node);
    yield {
      type: "push",
      node,
      topoStack: [...topoStack],
      visited: { ...visited },
      recursionStack: { ...recursionStack },
    };
  }

  // Run DFS for all unvisited nodes
  for (const node of nodes) {
    if (!visited[node]) yield* dfs(node);
  }

  // Reverse stack for final order
  yield {
    type: "done",
    topoOrder: [...topoStack].reverse(),
  };
}

export default function DFSTopologicalSort() {
  const [numNodes, setNumNodes] = useState(0);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [highlight, setHighlight] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [topoOrder, setTopoOrder] = useState([]);
  const [visited, setVisited] = useState({});
  const [recursionStack, setRecursionStack] = useState({});

  const [fromNode, setFromNode] = useState("");
  const [toNode, setToNode] = useState("");

  const handleGenerateNodes = () => {
    if (numNodes < 2) {
      toast.error("Please select at least 2 nodes!");
      return;
    }
    const generated = Array.from({ length: numNodes }, (_, i) =>
      String.fromCharCode(65 + i)
    );
    setNodes(generated);
    setEdges([]);
    setTopoOrder([]);
    setHighlight(null);
  };

  const handleAddEdge = () => {
    if (!fromNode || !toNode) {
      toast.error("Please fill both node fields!");
      return;
    }
    if (fromNode === toNode) {
      toast.error("No self-loops allowed!");
      return;
    }
    const exists = edges.find((e) => e.u === fromNode && e.v === toNode);
    if (exists) {
      toast.error("Edge already exists!");
      return;
    }
    setEdges([...edges, { u: fromNode, v: toNode }]);
    setFromNode("");
    setToNode("");
  };

  const handleStart = async () => {
    if (isRunning) return;
    if (nodes.length === 0 || edges.length === 0) {
      toast.error("Please generate nodes and edges first!");
      return;
    }

    setIsRunning(true);
    const gen = dfsTopologicalSort(nodes, edges);

    for (let step of gen) {
      setHighlight(step);
      if (step.visited) setVisited(step.visited);
      if (step.recursionStack) setRecursionStack(step.recursionStack);
      if (step.topoStack) setTopoOrder(step.topoStack);

      await new Promise((r) => setTimeout(r, 800));

      if (step.type === "cycle") {
        toast.error(step.message);
        break;
      }
    }
    setIsRunning(false);
  };

  const handleReset = () => {
    setEdges([]);
    setHighlight(null);
    setTopoOrder([]);
    setVisited({});
    setRecursionStack({});
  };

  const handleLoadExample = () => {
    const exampleNodes = ["A", "B", "C", "D", "E", "F"];
    const exampleEdges = [
      { u: "A", v: "C" },
      { u: "B", v: "C" },
      { u: "B", v: "D" },
      { u: "C", v: "E" },
      { u: "D", v: "F" },
      { u: "E", v: "F" },
    ];
    setNodes(exampleNodes);
    setEdges(exampleEdges);
    setTopoOrder([]);
    setHighlight(null);
    setNumNodes(6);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center p-6">
      <Toaster position="top-center" />
      <h1 className="text-4xl font-extrabold mb-6 text-green-400 drop-shadow-lg">
        Topological Sort (DFS Method)
      </h1>

      <div className="flex gap-4 mb-4">
        <input
          type="number"
          min={2}
          max={12}
          placeholder="Number of nodes"
          value={numNodes}
          onChange={(e) => setNumNodes(parseInt(e.target.value))}
          className="p-2 rounded-lg text-gray-900 bg-gray-100"
        />
        <button
          onClick={handleGenerateNodes}
          className="bg-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-500 transition"
        >
          Generate Nodes
        </button>
        <button
          onClick={handleLoadExample}
          className="bg-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-500 transition"
        >
          Load Example
        </button>
      </div>

      {nodes.length > 0 && (
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="flex flex-wrap gap-2 mb-4">
            {nodes.map((n, idx) => (
              <div
                key={idx}
                className="px-4 py-2 border rounded-lg bg-gray-800 text-white font-bold"
              >
                {n}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <select
              value={fromNode}
              onChange={(e) => setFromNode(e.target.value)}
              className="p-2 rounded-lg text-gray-900 bg-white"
            >
              <option value="">From</option>
              {nodes.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <select
              value={toNode}
              onChange={(e) => setToNode(e.target.value)}
              className="p-2 rounded-lg text-gray-900 bg-white"
            >
              <option value="">To</option>
              {nodes.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddEdge}
              className="bg-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-500 transition"
            >
              Add Edge
            </button>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleStart}
              disabled={isRunning}
              className={`${
                isRunning
                  ? "bg-green-800"
                  : "bg-green-600 hover:bg-green-500"
              } px-6 py-2 rounded-lg text-white font-semibold shadow-md transition`}
            >
              {isRunning ? "Running..." : "Start Visualization"}
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      <TopoGraph
        nodes={nodes}
        edges={edges}
        visited={visited}
        recursionStack={recursionStack}
        highlight={highlight}
        topoOrder={topoOrder}
      />
    </div>
  );
}
