import React, { useState } from "react";

export default function CycleDetection() {
  const [isDirected, setIsDirected] = useState(true);
  const [edges, setEdges] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [nodes, setNodes] = useState([]);
  const [log, setLog] = useState([]);
  const [visiting, setVisiting] = useState(null);
  const [visited, setVisited] = useState([]);
  const [cycleEdge, setCycleEdge] = useState(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState("");

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const addEdge = () => {
    if (!from || !to) return;
    const newEdge = { from, to };
    setEdges([...edges, newEdge]);
    setNodes((prev) => Array.from(new Set([...prev, from, to])));
    setFrom("");
    setTo("");
  };

  const loadExample = () => {
    if (isDirected) {
      setEdges([
        { from: "A", to: "B" },
        { from: "B", to: "C" },
        { from: "C", to: "A" },
      ]);
      setNodes(["A", "B", "C"]);
    } else {
      setEdges([
        { from: "A", to: "B" },
        { from: "B", to: "C" },
        { from: "C", to: "D" },
        { from: "D", to: "A" },
      ]);
      setNodes(["A", "B", "C", "D"]);
    }
    setLog([]);
    setVisited([]);
    setCycleEdge(null);
    setResult("");
  };

  const buildGraph = () => {
    const graph = {};
    for (let { from, to } of edges) {
      if (!graph[from]) graph[from] = [];
      graph[from].push(to);
      if (!isDirected) {
        if (!graph[to]) graph[to] = [];
        graph[to].push(from);
      }
    }
    return graph;
  };

  const detectCycle = async () => {
    if (running || edges.length === 0) return;
    setRunning(true);
    setVisited([]);
    setCycleEdge(null);
    setResult("");
    setLog(["🔍 Starting cycle detection..."]);

    const graph = buildGraph();
    const visitedSet = new Set();
    const recStack = new Set();
    let found = false;

    const dfs = async (node, parent = null) => {
      setVisiting(node);
      setLog((prev) => [...prev, `➡️ Visiting ${node}`]);
      await sleep(800);
      visitedSet.add(node);
      setVisited(Array.from(visitedSet));
      recStack.add(node);

      for (let neighbor of graph[node] || []) {
        setLog((prev) => [...prev, `Checking ${node} → ${neighbor}`]);
        await sleep(600);

        if (!visitedSet.has(neighbor)) {
          if (await dfs(neighbor, node)) return true;
        } else if (
          (isDirected && recStack.has(neighbor)) ||
          (!isDirected && neighbor !== parent)
        ) {
          setCycleEdge([node, neighbor]);
          setLog((prev) => [
            ...prev,
            `🚨 Cycle detected via ${node} → ${neighbor}`,
          ]);
          setResult("Cycle Detected ✅");
          found = true;
          return true;
        }
      }

      recStack.delete(node);
      setVisiting(null);
      setLog((prev) => [...prev, `⬅️ Backtracking from ${node}`]);
      return false;
    };

    for (let node of nodes) {
      if (!visitedSet.has(node)) {
        const res = await dfs(node);
        if (res) break;
      }
    }

    if (!found) {
      setResult("No Cycle Found ❌");
      setLog((prev) => [...prev, "✅ No cycle detected."]);
    }

    setRunning(false);
  };

  const reset = () => {
    setEdges([]);
    setNodes([]);
    setLog([]);
    setVisited([]);
    setVisiting(null);
    setCycleEdge(null);
    setResult("");
    setRunning(false);
  };

  const getNodePosition = (index, total) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = 160;
    const x = 200 + radius * Math.cos(angle);
    const y = 200 + radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full h-full p-6 bg-black text-white">
      {/* LEFT PANEL */}
      <div className="w-full md:w-1/3 bg-[#0f172a] p-6 rounded-2xl border border-gray-800 shadow-lg">
        <h2 className="text-xl font-bold text-indigo-400 mb-3">
          Cycle Detection ({isDirected ? "Directed" : "Undirected"})
        </h2>

        <p className="text-sm text-gray-400 mb-4">
          Algorithm Used:{" "}
          <span className="text-indigo-300 font-semibold">
            {isDirected
              ? "DFS with Recursion Stack"
              : "DFS with Parent Tracking"}
          </span>
        </p>

        <div className="flex items-center gap-2 mb-4">
          <label className="text-sm">Mode:</label>
          <select
            value={isDirected}
            onChange={(e) => setIsDirected(e.target.value === "true")}
            className="p-2 rounded bg-[#1e293b] border border-gray-700"
          >
            <option value="true">Directed</option>
            <option value="false">Undirected</option>
          </select>
        </div>

        <div className="flex gap-2 mb-3">
          <input
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value.toUpperCase())}
            className="p-2 w-1/2 rounded bg-[#1e293b] border border-gray-700"
          />
          <input
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value.toUpperCase())}
            className="p-2 w-1/2 rounded bg-[#1e293b] border border-gray-700"
          />
        </div>

        <button
          onClick={addEdge}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded mb-2"
        >
          ➕ Add Edge
        </button>

        <button
          onClick={loadExample}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded mb-2"
        >
          📘 Load Example
        </button>

        <button
          onClick={detectCycle}
          disabled={running}
          className="w-full py-2 bg-green-600 hover:bg-green-500 rounded mb-2 disabled:opacity-50"
        >
          {running ? "Running..." : "▶️ Detect Cycle"}
        </button>

        <button
          onClick={reset}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          🔁 Reset
        </button>

        <div className="mt-4">
          <h3 className="font-semibold text-indigo-400 mb-2">
            Step-by-step Log
          </h3>
          <div className="max-h-48 overflow-auto text-sm bg-[#1e293b] p-2 rounded border border-gray-700">
            {log.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>

          {result && (
            <div
              className={`mt-3 p-2 rounded text-center font-bold ${
                result.includes("No Cycle")
                  ? "bg-green-800 text-green-300"
                  : "bg-red-800 text-red-300"
              }`}
            >
              {result}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT VISUALIZATION */}
      <div className="flex-1 relative bg-[#020617] rounded-2xl border border-gray-800 shadow-inner">
        <svg width="100%" height="460">
          {/* Edges */}
          {edges.map((edge, i) => {
            const fromIndex = nodes.indexOf(edge.from);
            const toIndex = nodes.indexOf(edge.to);
            if (fromIndex === -1 || toIndex === -1) return null;
            const { x: x1, y: y1 } = getNodePosition(fromIndex, nodes.length);
            const { x: x2, y: y2 } = getNodePosition(toIndex, nodes.length);
            const isCycle =
              cycleEdge &&
              ((cycleEdge[0] === edge.from && cycleEdge[1] === edge.to) ||
                (cycleEdge[0] === edge.to && cycleEdge[1] === edge.from));
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isCycle ? "red" : "#6b7280"}
                strokeWidth={isCycle ? 3 : 2}
                strokeDasharray={isCycle ? "6,4" : "none"}
                className={isCycle ? "animate-pulse" : ""}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => {
            const { x, y } = getNodePosition(i, nodes.length);
            const isVisited = visited.includes(node);
            const isActive = visiting === node;
            return (
              <g key={node}>
                <circle
                  cx={x}
                  cy={y}
                  r="20"
                  fill={
                    isActive
                      ? "orange"
                      : isVisited
                      ? "#2563eb"
                      : "#1e293b"
                  }
                  stroke="white"
                  strokeWidth="2"
                  className={isActive ? "animate-ping" : ""}
                />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  className="text-white text-sm font-bold"
                >
                  {node}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
