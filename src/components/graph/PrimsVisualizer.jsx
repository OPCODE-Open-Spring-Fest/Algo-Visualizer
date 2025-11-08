// src/components/graph/PrimsVisualizer.jsx

import React, { useRef, useState } from "react";
import { primSteps } from "../../algorithms/graph/prim";

export default function PrimsVisualizer() {
  const svgRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selected, setSelected] = useState({ from: null, to: null });
  const [running, setRunning] = useState(false);

  const [startNode, setStartNode] = useState(1);
  const [status, setStatus] = useState("Idle");
  const [stepIndex, setStepIndex] = useState(0);

  const [visitedSnap, setVisitedSnap] = useState([]);
  const [frontierSnap, setFrontierSnap] = useState([]);

  // Node creation
  const addNode = (e) => {
    if (running) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = nodes.length + 1;

    setNodes([...nodes, { id, x, y, label: `N${id}` }]);
  };

  // Edge creation
  const handleNodeClick = (id) => {
    if (running) return;

    if (!selected.from) {
      setSelected({ from: id, to: null });
      return;
    }

    if (selected.from === id) return;

    const w = parseInt(prompt("Enter edge weight:"), 10);
    if (!isNaN(w)) {
      setEdges((prev) => [
        ...prev,
        {
          from: selected.from,
          to: id,
          weight: w,
          colorClass: "stroke-gray-500",
        },
      ]);
    }

    setSelected({ from: null, to: null });
  };

  // Start visualization
  const start = async () => {
    if (running || nodes.length < 2 || edges.length === 0) {
      alert("Create nodes and edges first.");
      return;
    }

    setRunning(true);
    setStatus("Running...");
    setStepIndex(0);

    const delay = 900;
    const steps = primSteps(edges, nodes.length, startNode);

    for (const step of steps) {
      const { type, edge, visited = [], frontier = [], mst = [] } = step;

      setVisitedSnap(visited);
      setFrontierSnap(frontier);

      if (edge) {
        setEdges((prev) =>
          prev.map((e) =>
            (e.from === edge.from && e.to === edge.to) ||
            (e.from === edge.to && e.to === edge.from)
              ? {
                  ...e,
                  colorClass:
                    type === "consider"
                      ? "stroke-blue-400"
                      : type === "add"
                      ? "stroke-green-400"
                      : type === "skip"
                      ? "stroke-red-500"
                      : "stroke-gray-500",
                }
              : e
          )
        );
      }

      setStatus(
        type === "consider"
          ? `Considering edge (${edge.from}, ${edge.to})`
          : type === "add"
          ? `Added edge (${edge.from}, ${edge.to})`
          : type === "skip"
          ? `Skipped edge (${edge.from}, ${edge.to})`
          : `Completed! MST size = ${mst.length}`
      );

      await new Promise((r) => setTimeout(r, delay));
      setStepIndex((i) => i + 1);
    }

    setRunning(false);
  };

  const reset = () => {
    setNodes([]);
    setEdges([]);
    setSelected({ from: null, to: null });

    setVisitedSnap([]);
    setFrontierSnap([]);

    setStartNode(1);
    setStatus("Idle");
    setStepIndex(0);

    setRunning(false);
  };

  // Render nodes
  const renderNodes = () =>
    nodes.map((n, idx) => {
      const isVisited = visitedSnap[idx] ?? false;
      const isStart = n.id === startNode;

      return (
        <g
          key={n.id}
          transform={`translate(${n.x}, ${n.y})`}
          onClick={() => handleNodeClick(n.id)}
          className="cursor-pointer"
        >
          <circle
            r={18}
            className={`stroke-indigo-400 stroke-2 transition-all duration-300 ${
              isVisited
                ? "fill-green-700"
                : isStart
                ? "fill-indigo-700"
                : "fill-gray-900"
            }`}
          />

          <text
            y={5}
            textAnchor="middle"
            className="fill-indigo-200 font-semibold"
          >
            {n.label}
          </text>
        </g>
      );
    });

  // Render edges
  const renderEdges = () =>
    edges.map((e, i) => {
      const a = nodes.find((n) => n.id === e.from);
      const b = nodes.find((n) => n.id === e.to);
      if (!a || !b) return null;

      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2;

      return (
        <g key={i}>
          <line
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            strokeWidth={4}
            className={`${e.colorClass} transition-all duration-500`}
            strokeLinecap="round"
          />

          <text
            x={cx}
            y={cy - 8}
            className="fill-indigo-300"
            fontSize={12}
            textAnchor="middle"
          >
            {e.weight}
          </text>
        </g>
      );
    });

  return (
    <div className="w-full">

      {/* 📘 Instructions */}
      <div className="max-w-4xl mx-auto mb-6 p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-md text-sm text-gray-300">
        <h3 className="text-indigo-400 font-bold mb-2 text-center">
          How to Use Prim’s MST Visualizer
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Double-click on the canvas to add nodes.</li>
          <li>Click two nodes to create a weighted edge.</li>
          <li>Select the start node.</li>
          <li>Press <b>Start Visualization</b> to watch Prim’s algorithm step-by-step.</li>
          <li>Green = added to MST, Blue = considered, Red = skipped.</li>
        </ul>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6 justify-center">
        <label className="text-sm text-indigo-200 flex items-center gap-2">
          Start node:
          <select
            disabled={running}
            value={startNode}
            onChange={(e) => setStartNode(parseInt(e.target.value))}
            className="bg-gray-800 border border-gray-700 px-2 py-1 rounded"
          >
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={start}
          disabled={running}
          className={`px-6 py-2 rounded-lg font-semibold text-white shadow-md transition-all duration-300 ${
            running
              ? "bg-indigo-800 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >
          {running ? "Visualizing..." : "Start Visualization"}
        </button>

        <button
          onClick={reset}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-300"
        >
          Reset
        </button>
      </div>

      {/* Status */}
      <div className="text-sm text-center text-indigo-300 mb-4">
        <p>
          Status:{" "}
          <span className="font-medium text-indigo-400">{status}</span>
        </p>
        <p>
          Step:{" "}
          <span className="font-medium text-indigo-400">{stepIndex}</span>
        </p>
      </div>

      {/* Layout */}
      <div className="flex w-full max-w-6xl mx-auto">
        {/* Left Panel */}
        <div className="w-1/3 bg-gray-900 border border-gray-700 rounded-lg p-3 mr-6 shadow-lg">
          <h2 className="text-lg font-bold mb-2 text-center text-indigo-400">
            Visited Nodes
          </h2>

          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {nodes.map((n, idx) => (
              <span
                key={n.id}
                className={`px-2 py-1 rounded border text-xs ${
                  visitedSnap[idx]
                    ? "bg-green-700 border-green-500 text-green-100"
                    : "bg-gray-800 border-gray-700 text-gray-300"
                }`}
              >
                {n.label}
              </span>
            ))}
          </div>

          <h2 className="text-lg font-bold mb-2 text-center text-indigo-400">
            Frontier (Min Edges)
          </h2>

          <div className="space-y-1 max-h-56 overflow-auto text-sm">
            {frontierSnap.length > 0 ? (
              frontierSnap
                .slice()
                .sort((a, b) => a.weight - b.weight)
                .map((e, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between bg-gray-800 border border-gray-700 rounded px-2 py-1"
                  >
                    <span>
                      ({e.from}, {e.to})
                    </span>
                    <span>w={e.weight}</span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-center">Empty</p>
            )}
          </div>
        </div>

        {/* Canvas */}
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
