import React, { useRef, useState } from "react";

// Simple sleep utility consistent with other components
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function DFSTraversal() {
  const svgRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selected, setSelected] = useState({ from: null, to: null });
  const [startNode, setStartNode] = useState(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [intervalMs, setIntervalMs] = useState(700);
  const [stackView, setStackView] = useState([]);

  // Build adjacency list from current edges (undirected)
  const buildAdj = () => {
    const adj = new Map();
    nodes.forEach((n) => adj.set(n.id, []));
    edges.forEach((e) => {
      adj.get(e.from)?.push(e.to);
      adj.get(e.to)?.push(e.from);
    });
    // sort neighbors by id for deterministic traversal
    for (const [k, arr] of adj.entries()) arr.sort((a, b) => a - b);
    return adj;
  };

  // Add node on double click
  const addNode = (e) => {
    if (running) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newNode = {
      id: nodes.length + 1,
      x,
      y,
      label: `N${nodes.length + 1}`,
      state: "default", // default | current | visited
    };
    setNodes((prev) => [...prev, newNode]);
  };

  // Click to create edge or to select start node (if shift key held)
  const handleNodeClick = (id, evt) => {
    if (running) return;

    if (evt && evt.shiftKey) {
      setStartNode(id);
      setStatus(`Start node set to ${id}`);
      return;
    }

    if (!selected.from) {
      setSelected({ from: id, to: null });
    } else if (selected.from && !selected.to && selected.from !== id) {
      setEdges((prev) => [
        ...prev,
        { from: selected.from, to: id, color: "stroke-gray-500" },
      ]);
      setSelected({ from: null, to: null });
    } else if (selected.from === id) {
      setSelected({ from: null, to: null });
    }
  };

  const resetGraph = () => {
    setNodes([]);
    setEdges([]);
    setSelected({ from: null, to: null });
    setStartNode(null);
    setRunning(false);
    setPaused(false);
    setStatus("Idle");
    setStackView([]);
  };

  const highlightNode = (id, state) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, state } : n)));
  };

  const highlightEdge = (u, v, tempColor) => {
    setEdges((prev) =>
      prev.map((e) => {
        const match =
          (e.from === u && e.to === v) || (e.from === v && e.to === u);
        if (!match) return e;
        return { ...e, color: tempColor };
      })
    );
  };

  const waitIfPaused = async () => {
    while (paused) {
      // poll while paused without blocking UI
      // eslint-disable-next-line no-await-in-loop
      await sleep(150);
    }
  };

  const runDFS = async () => {
    if (running) return;
    if (nodes.length === 0) return;

    const adj = buildAdj();
    let start = startNode ?? nodes[0]?.id;
    setRunning(true);
    setPaused(false);
    setStatus("Running DFS...");

    const visited = new Set();

    const dfsVisit = async (u) => {
      await waitIfPaused();
      visited.add(u);
      setStackView((s) => [...s, u]);
      highlightNode(u, "current");
      setStatus(`Visiting ${u}`);
      await sleep(intervalMs);

      const neighbors = adj.get(u) || [];
      for (const v of neighbors) {
        await waitIfPaused();
        if (!visited.has(v)) {
          highlightEdge(u, v, "stroke-orange-400"); // exploring edge
          await sleep(intervalMs / 2);
          await dfsVisit(v);
          highlightEdge(u, v, "stroke-blue-400"); // finalized traversal edge
        }
      }

      // backtrack
      highlightNode(u, "visited");
      setStackView((s) => s.filter((x) => x !== u));
      await sleep(intervalMs / 2);
    };

    // Ensure all components are covered
    const order = [start, ...nodes.map((n) => n.id).filter((id) => id !== start)];
    for (const u of order) {
      if (!visited.has(u)) {
        await dfsVisit(u);
      }
    }

    setRunning(false);
    setStatus("Completed");
  };

  const togglePause = () => {
    if (!running) return;
    setPaused((p) => !p);
    setStatus((s) => (paused ? "Running DFS..." : "Paused"));
  };

  const renderEdges = () =>
    edges.map((e, i) => {
      const a = nodes.find((n) => n.id === e.from);
      const b = nodes.find((n) => n.id === e.to);
      if (!a || !b) return null;
      return (
        <line
          key={i}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          strokeWidth={4}
          className={`${e.color || "stroke-gray-500"} transition-all duration-300`}
          strokeLinecap="round"
        />
      );
    });

  const renderNodes = () =>
    nodes.map((n) => (
      <g
        key={n.id}
        transform={`translate(${n.x}, ${n.y})`}
        onClick={(evt) => handleNodeClick(n.id, evt)}
        className="cursor-pointer"
      >
        <circle
          r={18}
          className={`stroke-indigo-400 stroke-2 ${
            n.state === "current"
              ? "fill-orange-500"
              : n.state === "visited"
              ? "fill-blue-600"
              : selected.from === n.id
              ? "fill-indigo-700"
              : "fill-gray-900"
          } transition-all duration-300`}
        />
        <text x={0} y={5} textAnchor="middle" className="fill-indigo-200 font-semibold">
          {n.label}
        </text>
      </g>
    ));

  return (
    <div className="w-full">
      {/* Help */}
      <div className="max-w-4xl mx-auto mb-6 p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-md text-sm text-gray-300">
        <h3 className="text-indigo-400 font-bold mb-2 text-center">How to Use DFS Traversal</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Double-click on the canvas to create nodes.</li>
          <li>Click one node and then another to create an undirected edge.</li>
          <li>Shift+Click a node to set it as the start node.</li>
          <li>Click Run DFS to start. Pause/Resume with Pause.</li>
          <li>DFS will continue to other components after finishing the start component.</li>
        </ul>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4 justify-center">
        <button
          onClick={runDFS}
          disabled={running && !paused}
          className={`px-5 py-2 rounded-lg font-semibold text-white shadow-md transition-all duration-300 ${
            running && !paused ? "bg-indigo-800 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >
          {running ? (paused ? "Resume DFS" : "Running...") : "Run DFS"}
        </button>
        <button
          onClick={togglePause}
          disabled={!running}
          className={`px-5 py-2 rounded-lg font-semibold text-white shadow-md transition-all duration-300 ${
            running ? "bg-yellow-600 hover:bg-yellow-500" : "bg-gray-700 cursor-not-allowed"
          }`}
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={resetGraph}
          className="px-5 py-2 rounded-lg font-semibold text-white shadow-md transition-all duration-300 bg-gray-700 hover:bg-gray-600"
        >
          Reset
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <label>Speed:</label>
          <input
            type="range"
            min={200}
            max={1500}
            step={50}
            value={intervalMs}
            onChange={(e) => setIntervalMs(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="text-sm text-indigo-300 self-center">Status: <span className="text-indigo-400 font-medium">{status}</span></div>
      </div>

      {/* Layout: Stack + Graph */}
      <div className="flex w-full max-w-6xl mx-auto">
        {/* Recursion Stack */}
        <div className="w-1/4 bg-gray-900 border border-gray-700 rounded-lg p-3 mr-6 shadow-lg">
          <h2 className="text-lg font-bold mb-3 text-center text-indigo-400">Recursion Stack</h2>
          <div className="space-y-2">
            {stackView.map((id, idx) => (
              <div key={`${id}-${idx}`} className="px-3 py-2 rounded bg-indigo-900/40 border border-indigo-700 text-indigo-200">
                Node {id}
              </div>
            ))}
            {stackView.length === 0 && <div className="text-sm text-gray-400 text-center">Empty</div>}
          </div>
          <div className="mt-4 text-xs text-gray-400">
            Tip: Shift+Click to set start node. Current node is orange. Visited nodes are blue.
          </div>
        </div>

        {/* Graph Canvas */}
        <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
          <svg
            ref={svgRef}
            onDoubleClick={addNode}
            width="100%"
            height={500}
            viewBox="0 0 800 500"
            className="bg-gray-950"
          >
            {renderEdges()}
            {renderNodes()}
          </svg>
        </div>
      </div>
    </div>
  );
}
