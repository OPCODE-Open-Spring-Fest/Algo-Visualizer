import React, { useState, useRef } from "react";
import { kruskalSteps } from "../../algorithms/graph/kruskal";

export default function KruskalVisualizer() {
  const svgRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selected, setSelected] = useState({ from: null, to: null });
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [dsuState, setDsuState] = useState([]);
  const [highlight, setHighlight] = useState(null);

  // 🟢 Add node
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
    };
    setNodes([...nodes, newNode]);
  };

  // 🟣 Add edges
  const handleNodeClick = (id) => {
    if (running) return;
    if (!selected.from) {
      setSelected({ from: id, to: null });
    } else if (selected.from && !selected.to && selected.from !== id) {
      const weight = parseInt(prompt("Enter edge weight:"), 10);
      if (!isNaN(weight)) {
        setEdges([
          ...edges,
          { from: selected.from, to: id, weight, colorClass: "stroke-gray-500" },
        ]);
      }
      setSelected({ from: null, to: null });
    }
  };

  // 🧩 Kruskal visualization
  const startVisualization = async () => {
    if (running || edges.length === 0) return;
    setRunning(true);
    setStatus("Running...");
    const steps = kruskalSteps(edges, nodes.length);
    const interval = 1000;

    for (let step of steps) {
      const { type, edge, dsu } = step;
      setDsuState(dsu || []);
      setHighlight({ from: edge.from - 1, to: edge.to - 1 });

      setEdges((prev) =>
        prev.map((e) =>
          e.from === edge.from && e.to === edge.to
            ? {
                ...e,
                colorClass:
                  type === "consider"
                    ? "stroke-blue-400"
                    : type === "add"
                    ? "stroke-green-400"
                    : "stroke-red-500",
              }
            : e
        )
      );

      setStatus(
        type === "consider"
          ? `Considering edge (${edge.from}, ${edge.to})`
          : type === "add"
          ? `Added edge (${edge.from}, ${edge.to}) to MST`
          : type === "skip"
          ? `Skipped edge (${edge.from}, ${edge.to}) — forms cycle`
          : "Done"
      );

      await new Promise((r) => setTimeout(r, interval));
      setStepIndex((i) => i + 1);
    }

    setRunning(false);
    setStatus("Completed!");
  };

  const resetGraph = () => {
    setNodes([]);
    setEdges([]);
    setSelected({ from: null, to: null });
    setRunning(false);
    setStatus("Idle");
    setDsuState([]);
    setStepIndex(0);
  };

  // 🧩 Render edges
  const renderEdges = () =>
    edges.map((edge, i) => {
      const fromNode = nodes.find((n) => n.id === edge.from);
      const toNode = nodes.find((n) => n.id === edge.to);
      if (!fromNode || !toNode) return null;

      const { x: x1, y: y1 } = fromNode;
      const { x: x2, y: y2 } = toNode;
      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;

      return (
        <g key={i}>
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeWidth={4}
            className={`${edge.colorClass} transition-all duration-500`}
            strokeLinecap="round"
          />
          <text
            x={cx}
            y={cy - 8}
            fontSize={12}
            textAnchor="middle"
            className="fill-indigo-300"
          >
            {edge.weight}
          </text>
        </g>
      );
    });

  // 🧩 Render nodes
  const renderNodes = () =>
    nodes.map((n) => (
      <g
        key={n.id}
        transform={`translate(${n.x}, ${n.y})`}
        onClick={() => handleNodeClick(n.id)}
        className="cursor-pointer"
      >
        <circle
          r={18}
          className={`stroke-indigo-400 stroke-2 ${
            selected.from === n.id ? "fill-indigo-700" : "fill-gray-900"
          } transition-all duration-300`}
        />
        <text
          x={0}
          y={5}
          textAnchor="middle"
          className="fill-indigo-200 font-semibold"
        >
          {n.label}
        </text>
      </g>
    ));

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex gap-4 mb-6 justify-center">
        <button
          className={`px-6 py-2 rounded-lg font-semibold text-white shadow-md transition-all duration-300 ${
            running
              ? "bg-indigo-800 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
          onClick={startVisualization}
          disabled={running}
        >
          {running ? "Visualizing..." : "Start Visualization"}
        </button>

        <button
          onClick={resetGraph}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-300"
        >
          Reset
        </button>
      </div>

      <div className="text-sm text-center text-indigo-300 mb-6">
        <p>Status: <span className="font-medium text-indigo-400">{status}</span></p>
        <p>Step: <span className="font-medium text-indigo-400">{stepIndex}</span></p>
      </div>

      {/* Layout: DSU Panel + Graph */}
      <div className="flex w-full max-w-6xl">
        {/* Left DSU Panel */}
        <div className="w-1/4 bg-gray-900 border border-gray-700 rounded-lg p-3 mr-6 shadow-lg">
          <h2 className="text-lg font-bold mb-3 text-center text-indigo-400">
            Disjoint Set (DSU)
          </h2>

          <div className="flex flex-wrap justify-center gap-3">
            {nodes.map((n, i) => (
              <div key={n.id} className="relative text-center">
                <div className="text-sm font-medium text-indigo-300 mb-1">
                  {n.label}
                </div>
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border border-indigo-500 ${
                    dsuState[i] === i ? "bg-green-700" : "bg-indigo-800"
                  }`}
                >
                  <span className="text-indigo-200 font-semibold">
                    N{(dsuState[i] ?? i) + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Graph */}
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
