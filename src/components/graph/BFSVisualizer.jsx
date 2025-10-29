import React, { useState, useRef } from "react";
import { bfsSteps } from "../../algorithms/graph/bfs";

export default function BFSVisualizer() {
  const svgRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selected, setSelected] = useState({ from: null, to: null });
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Double-click to add nodes");

  // --- BFS State ---
  const [stepIndex, setStepIndex] = useState(0);
  const [queueState, setQueueState] = useState([]);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [discoveryOrder, setDiscoveryOrder] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);

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
    setStatus("Click two nodes to create an edge");
  };

  // 🟣 Add edges
  const handleNodeClick = (id) => {
    if (running) return;
    if (!selected.from) {
      setSelected({ from: id, to: null });
    } else if (selected.from && !selected.to && selected.from !== id) {
      // NOTE: This creates a DIRECTED edge (from -> to)
      setEdges([
        ...edges,
        {
          from: selected.from,
          to: id,
          colorClass: "stroke-gray-500",
        },
      ]);
      setSelected({ from: null, to: null });
    }
  };

  // 🧩 BFS visualization
  const startVisualization = async () => {
    if (running || nodes.length === 0) return;

    const startNodeId = parseInt(prompt("Enter Start Node ID (e.g., 1):"), 10);
    if (isNaN(startNodeId) || !nodes.find((n) => n.id === startNodeId)) {
      setStatus("Invalid start node ID.");
      return;
    }

    setRunning(true);
    resetVisualizationState(); // Clear previous run

    // Call the bfsSteps function
    const steps = bfsSteps(nodes, edges, startNodeId);
    const interval = 1200; // 1.2 seconds per step

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setStepIndex(i + 1);
      setStatus(step.log);
      setQueueState(step.queueState);
      setVisitedNodes(step.visitedSet);
      setDiscoveryOrder(step.order);
      setCurrentNode(step.node); // Highlight the node being acted upon

      await new Promise((r) => setTimeout(r, interval));
    }

    setRunning(false);
    setStatus("Completed!");
    setCurrentNode(null);
  };

  // 🟠 Resets the visualization, but keeps the graph
  const resetVisualizationState = () => {
    setRunning(false);
    setStatus("Idle. Click 'Start' to run again.");
    setQueueState([]);
    setVisitedNodes(new Set());
    setDiscoveryOrder([]);
    setCurrentNode(null);
    setStepIndex(0);
    setEdges(edges.map((e) => ({ ...e, colorClass: "stroke-gray-500" })));
  };

  // 🔴 Resets the entire canvas
  const resetGraph = () => {
    setNodes([]);
    setEdges([]);
    setSelected({ from: null, to: null });
    setRunning(false);
    setStatus("Double-click to add nodes");
    setQueueState([]);
    setVisitedNodes(new Set());
    setDiscoveryOrder([]);
    setCurrentNode(null);
    setStepIndex(0);
  };

  // 🧩 Render edges
  const renderEdges = () =>
    edges.map((edge, i) => {
      const fromNode = nodes.find((n) => n.id === edge.from);
      const toNode = nodes.find((n) => n.id === edge.to);
      if (!fromNode || !toNode) return null;

      return (
        <g key={i}>
          <line
            x1={fromNode.x}
            y1={fromNode.y}
            x2={toNode.x}
            y2={toNode.y}
            strokeWidth={3}
            className={`${edge.colorClass} transition-all duration-500`}
            markerEnd="url(#arrow)"
          />
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
            currentNode === n.id
              ? "fill-yellow-500" // 🟡 Current
              : visitedNodes.has(n.id)
              ? "fill-green-600" // 🟢 Visited/Processed
              : queueState.includes(n.id)
              ? "fill-blue-600" // 🟦 In Queue
              : selected.from === n.id
              ? "fill-indigo-700" // 🟣 Selected
              : "fill-gray-900" // Default
          } transition-all duration-300`}
        />
        <text
          x={0}
          y={5}
          textAnchor="middle"
          className="fill-indigo-200 font-semibold select-none"
        >
          {n.label}
        </text>
      </g>
    ));

  return (
    <div className="w-full">
      {/* 🧭 Manual / Instructions */}
      <div className="max-w-4xl mx-auto mb-6 p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-md text-sm text-gray-300">
        <h3 className="text-indigo-400 font-bold mb-2 text-center">
          How to Use the BFS Visualizer
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <b>Double-click</b> on the canvas to create a node.
          </li>
          <li>
            <b>Click one node</b> and then another to create a <b>directed</b>{" "}
            edge.
          </li>
          <li>
            Once your graph is ready, click <b>Start Visualization</b> and enter
            a Start Node ID.
          </li>
          <li>
            The algorithm will highlight the <b>current node</b> (yellow),
            <b> nodes in queue</b> (blue), and <b>processed nodes</b> (green).
          </li>
          <li>
            The <b>Queue & Discovery Order</b> panels show the algorithm's
            state.
          </li>
        </ul>
      </div>

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
          Reset Graph
        </button>
      </div>

      {/* Status + Step */}
      <div className="text-sm text-center text-indigo-300 mb-4 h-10">
        <p>
          Status: <span className="font-medium text-indigo-400">{status}</span>
        </p>
        <p>
          Step: <span className="font-medium text-indigo-400">{stepIndex}</span>
        </p>
      </div>

      {/* Layout: Data Structures + Graph */}
      <div className="flex w-full max-w-6xl mx-auto">
        {/* Left Data Panel */}
        <div className="w-1/4 bg-gray-900 border border-gray-700 rounded-lg p-3 mr-6 shadow-lg">
          {/* --- QUEUE --- */}
          <h2 className="text-lg font-bold mb-3 text-center text-indigo-400">
            Queue (FIFO)
          </h2>
          <div className="flex flex-col bg-gray-950 rounded-lg p-2 h-48 border border-gray-700 mb-4">
            {queueState.map((id, index) => (
              <div
                key={index}
                className={`text-white font-semibold text-center rounded p-1.5 mb-1.5 ${
                  index === 0 ? "bg-indigo-600" : "bg-blue-800"
                }`}
              >
                {index === 0 && (
                  <span className="text-xs font-light block">Front</span>
                )}
                Node {id}
              </div>
            ))}
            {queueState.length === 0 && (
              <span className="text-gray-500 m-auto">Queue is empty</span>
            )}
          </div>

          {/* --- DISCOVERY ORDER --- */}
          <h2 className="text-lg font-bold mb-3 text-center text-indigo-400">
            Discovery Order (Processed)
          </h2>
          <div className="flex flex-wrap gap-2 bg-gray-950 rounded-lg p-2 min-h-[50px] border border-gray-700">
            {discoveryOrder.map((id) => (
              <div
                key={id}
                className="bg-green-600 text-white font-semibold rounded px-2.5 py-1"
              >
                N{id}
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
            {/* Arrowhead Definition */}
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="10"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#6B7280" />
              </marker>
            </defs>
            {renderEdges()}
            {renderNodes()}
          </svg>
        </div>
      </div>
    </div>
  );
}
