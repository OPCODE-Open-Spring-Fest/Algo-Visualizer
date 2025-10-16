import React, { useState, useRef } from "react";
import { floydWarshallSteps } from "../../algorithms/graph/floydWarshall";

export default function FloydWarshallVisualizer() {
  const svgRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selected, setSelected] = useState({ from: null, to: null });
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [distanceMatrix, setDistanceMatrix] = useState([]);
  const [highlight, setHighlight] = useState({ k: null, i: null, j: null });
  const [message, setMessage] = useState("");

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

  // 🧩 Floyd-Warshall visualization
  const startVisualization = async () => {
    if (running || edges.length === 0) return;
    setRunning(true);
    setStatus("Running...");
    const steps = floydWarshallSteps(edges, nodes.length);
    const interval = 800;

    for (let step of steps) {
      const { type, dist, k, i, j, message: stepMessage } = step;
      
      setDistanceMatrix(dist || []);
      setMessage(stepMessage || "");

      if (type === "init") {
        setStatus("Initializing distance matrix...");
        setHighlight({ k: null, i: null, j: null });
      } else if (type === "intermediate") {
        setStatus(`Using node ${k + 1} as intermediate vertex`);
        setHighlight({ k, i: null, j: null });
      } else if (type === "update") {
        setStatus(`Updated distance from ${i + 1} to ${j + 1}`);
        setHighlight({ k, i, j });
        
        // Highlight the edge being updated
        setEdges((prev) =>
          prev.map((e) => ({
            ...e,
            colorClass:
              (e.from === i + 1 && e.to === k + 1) ||
              (e.from === k + 1 && e.to === j + 1)
                ? "stroke-green-400"
                : "stroke-gray-500",
          }))
        );
      } else if (type === "compare") {
        setHighlight({ k, i, j });
        setEdges((prev) =>
          prev.map((e) => ({
            ...e,
            colorClass: "stroke-gray-500",
          }))
        );
      } else if (type === "done") {
        setStatus(step.hasNegativeCycle ? "Negative cycle detected!" : "Completed!");
        setHighlight({ k: null, i: null, j: null });
        setEdges((prev) =>
          prev.map((e) => ({
            ...e,
            colorClass: "stroke-indigo-500",
          }))
        );
      }

      await new Promise((r) => setTimeout(r, interval));
      setStepIndex((i) => i + 1);
    }

    setRunning(false);
  };

  const resetGraph = () => {
    setNodes([]);
    setEdges([]);
    setSelected({ from: null, to: null });
    setRunning(false);
    setStatus("Idle");
    setDistanceMatrix([]);
    setStepIndex(0);
    setHighlight({ k: null, i: null, j: null });
    setMessage("");
  };

  // 🧩 Render edges
  const renderEdges = () =>
    edges.map((edge, i) => {
      const fromNode = nodes.find((n) => n.id === edge.from);
      const toNode = nodes.find((n) => n.id === edge.to);
      if (!fromNode || !toNode) return null;

      // Check if there's a reverse edge
      const hasReverseEdge = edges.some(
        (e) => e.from === edge.to && e.to === edge.from
      );

      const { x: x1, y: y1 } = fromNode;
      const { x: x2, y: y2 } = toNode;

      // Calculate angle and perpendicular offset for curved edges
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const curveOffset = hasReverseEdge ? 15 : 0; // Curve the edge if there's a reverse edge
      
      // Calculate control point for quadratic curve
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const perpAngle = angle + Math.PI / 2;
      const controlX = midX + Math.cos(perpAngle) * curveOffset;
      const controlY = midY + Math.sin(perpAngle) * curveOffset;

      // Calculate point on curve for arrow (at 85% of curve length)
      const t = 0.85;
      const curveX = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * controlX + t * t * x2;
      const curveY = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * controlY + t * t * y2;
      
      // Calculate tangent angle at arrow position for proper arrow direction
      const tanX = 2 * (1 - t) * (controlX - x1) + 2 * t * (x2 - controlX);
      const tanY = 2 * (1 - t) * (controlY - y1) + 2 * t * (y2 - controlY);
      const tangentAngle = Math.atan2(tanY, tanX);

      const arrowSize = 10;
      const offsetDist = 18; // offset from node center
      
      // Calculate arrow position
      const finalAngle = hasReverseEdge ? tangentAngle : angle;
      const arrowBaseX = hasReverseEdge ? curveX : x2 - Math.cos(angle) * offsetDist;
      const arrowBaseY = hasReverseEdge ? curveY : y2 - Math.sin(angle) * offsetDist;

      // Label position (at 50% of curve)
      const labelT = 0.5;
      const labelX = (1 - labelT) * (1 - labelT) * x1 + 2 * (1 - labelT) * labelT * controlX + labelT * labelT * x2;
      const labelY = (1 - labelT) * (1 - labelT) * y1 + 2 * (1 - labelT) * labelT * controlY + labelT * labelT * y2;

      return (
        <g key={i}>
          {hasReverseEdge ? (
            // Curved path for bidirectional edges
            <path
              d={`M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`}
              fill="none"
              strokeWidth={3}
              className={`${edge.colorClass} transition-all duration-500`}
              strokeLinecap="round"
            />
          ) : (
            // Straight line for unidirectional edges
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth={3}
              className={`${edge.colorClass} transition-all duration-500`}
              strokeLinecap="round"
            />
          )}
          
          {/* Arrow head */}
          <polygon
            points={`${arrowBaseX},${arrowBaseY} ${
              arrowBaseX - arrowSize * Math.cos(finalAngle - Math.PI / 6)
            },${arrowBaseY - arrowSize * Math.sin(finalAngle - Math.PI / 6)} ${
              arrowBaseX - arrowSize * Math.cos(finalAngle + Math.PI / 6)
            },${arrowBaseY - arrowSize * Math.sin(finalAngle + Math.PI / 6)}`}
            className={`${edge.colorClass.replace("stroke", "fill")} transition-all duration-500`}
          />
          
          {/* Weight label with background for better readability */}
          <g>
            <rect
              x={labelX - 12}
              y={labelY - 16}
              width={24}
              height={16}
              rx={3}
              className="fill-gray-900 opacity-90"
            />
            <text
              x={labelX}
              y={labelY - 6}
              fontSize={12}
              textAnchor="middle"
              className="fill-indigo-300 font-semibold"
            >
              {edge.weight}
            </text>
          </g>
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
            selected.from === n.id 
              ? "fill-indigo-700" 
              : highlight.k === n.id - 1
              ? "fill-yellow-700"
              : "fill-gray-900"
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

  // 🧩 Render distance matrix
  const renderDistanceMatrix = () => {
    if (distanceMatrix.length === 0) return null;

    return (
      <div className="overflow-auto">
        <h3 className="text-sm font-bold mb-2 text-center text-indigo-400">
          Distance Matrix
        </h3>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-gray-600 p-1 bg-gray-800 text-indigo-300">
                
              </th>
              {nodes.map((n) => (
                <th
                  key={n.id}
                  className={`border border-gray-600 p-1 bg-gray-800 text-indigo-300 ${
                    highlight.j === n.id - 1 ? "bg-yellow-900" : ""
                  }`}
                >
                  {n.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {distanceMatrix.map((row, i) => (
              <tr key={i}>
                <td
                  className={`border border-gray-600 p-1 bg-gray-800 font-semibold text-indigo-300 ${
                    highlight.i === i ? "bg-yellow-900" : ""
                  }`}
                >
                  {nodes[i]?.label}
                </td>
                {row.map((val, j) => (
                  <td
                    key={j}
                    className={`border border-gray-600 p-1 text-center ${
                      i === j
                        ? "bg-gray-700 text-gray-500"
                        : highlight.i === i && highlight.j === j
                        ? "bg-green-700 text-white font-bold"
                        : highlight.k !== null &&
                          ((i === highlight.i && j === highlight.k) ||
                            (i === highlight.k && j === highlight.j))
                        ? "bg-blue-800 text-white"
                        : "bg-gray-900 text-indigo-200"
                    } transition-all duration-300`}
                  >
                    {val === Infinity ? "∞" : val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* 🧭 Manual / Instructions */}
      <div className="max-w-4xl mx-auto mb-6 p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-md text-sm text-gray-300">
        <h3 className="text-indigo-400 font-bold mb-2 text-center">
          How to Use the Floyd-Warshall Visualizer
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <b>Double-click</b> on the canvas to create a node.
          </li>
          <li>
            <b>Click one node</b> and then another to create a <b>directed edge</b>.
          </li>
          <li>
            You'll be prompted to enter the <b>edge weight</b>.
          </li>
          <li>
            Once your graph is ready, click <b>Start Visualization</b>.
          </li>
          <li>
            The algorithm finds shortest paths between <b>all pairs</b> of nodes.
          </li>
          <li>
            Watch the <b>distance matrix</b> update as intermediate vertices are considered.
          </li>
          <li>
            <b>Yellow highlight</b> shows the current intermediate vertex.
          </li>
          <li>
            <b>Green highlight</b> shows when a shorter path is found.
          </li>
          <li>
            Click <b>Reset</b> to clear and start again.
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
          Reset
        </button>
      </div>

      {/* Status + Step */}
      <div className="text-sm text-center text-indigo-300 mb-4">
        <p>
          Status: <span className="font-medium text-indigo-400">{status}</span>
        </p>
        <p>
          Step: <span className="font-medium text-indigo-400">{stepIndex}</span>
        </p>
        {message && (
          <p className="text-xs mt-2 text-gray-400">
            {message}
          </p>
        )}
      </div>

      {/* Layout: Distance Matrix + Graph */}
      <div className="flex w-full max-w-6xl mx-auto gap-6">
        {/* Left Distance Matrix Panel */}
        <div className="w-2/5 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg max-h-[600px] overflow-auto">
          {distanceMatrix.length > 0 ? (
            renderDistanceMatrix()
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>Distance matrix will appear here</p>
              <p className="text-xs mt-2">
                Create a graph and start visualization
              </p>
            </div>
          )}
        </div>

        {/* Right Graph */}
        <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
          <svg
            ref={svgRef}
            onDoubleClick={addNode}
            width="100%"
            height={600}
            viewBox="0 0 800 600"
            className="bg-gray-950"
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3, 0 6"
                  className="fill-gray-500"
                />
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
