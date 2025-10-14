import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import BellmanFordVisualizer from "../../components/graph/BellmanFordVisualizer";
import GraphVisualizer from "../../components/graph/GraphVisualizer";

// Bellman-Ford generator function
function* bellmanFord(nodes, edges, source) {
    const dist = {};
    nodes.forEach((n) => (dist[n] = Infinity));
    dist[source] = 0;

    for (let i = 0; i < nodes.length - 1; i++) {
        let updated = false;
        for (let { u, v, w } of edges) {
            if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                updated = true;
                yield { type: "relax", iteration: i + 1, edge: { u, v, w }, dist: { ...dist } };
            } else {
                yield { type: "skip", iteration: i + 1, edge: { u, v, w }, dist: { ...dist } };
            }
        }
        if (!updated) break;
    }

    // Negative cycle check
    for (let { u, v, w } of edges) {
        if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
            yield { type: "negative-cycle", edge: { u, v, w } };
            return;
        }
    }

    yield { type: "done", dist };
}

export default function BellmanFord() {
    const [numNodes, setNumNodes] = useState(0);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [source, setSource] = useState(null);
    const [distances, setDistances] = useState({});
    const [highlight, setHighlight] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    // Edge input state
    const [fromNode, setFromNode] = useState("");
    const [toNode, setToNode] = useState("");
    const [weight, setWeight] = useState("");

    // Generate nodes automatically
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
        setSource(generated[0]);
        setDistances({});
        setHighlight(null);
    };

    // Add or edit edge
    const handleAddEdge = () => {
        if (!fromNode || !toNode || !weight) {
            toast.error("Fill all edge fields!");
            return;
        }
        const existingIndex = edges.findIndex(
            (e) => e.u === fromNode && e.v === toNode
        );
        const newEdge = { u: fromNode, v: toNode, w: parseInt(weight) };
        if (existingIndex >= 0) {
            const updatedEdges = [...edges];
            updatedEdges[existingIndex] = newEdge;
            setEdges(updatedEdges);
        } else {
            setEdges([...edges, newEdge]);
        }
        setFromNode("");
        setToNode("");
        setWeight("");
    };

    // Run Bellman-Ford visualization
    const handleStart = async () => {
        if (isRunning) return;
        if (!source) {
            toast.error("Select a source node!");
            return;
        }

        setIsRunning(true);
        const gen = bellmanFord(nodes, edges, source);
        for (let step of gen) {
            setHighlight(step);
            if (step.dist) setDistances(step.dist);
            await new Promise((r) => setTimeout(r, 800));
            if (step.type === "negative-cycle") {
                toast.error(`Negative cycle detected on edge ${step.edge.u} → ${step.edge.v}`);
                break;
            }
        }
        setIsRunning(false);
    };

    const handleReset = () => {
        setDistances({});
        setHighlight(null);
        setEdges([]);
    };

    // Load example graph
    const handleLoadExample = () => {
        const exampleNodes = ["A", "B", "C", "D", "E", "F"];
        const exampleEdges = [
            { u: "A", v: "B", w: 2 },
            { u: "A", v: "C", w: 5 },
            { u: "B", v: "C", w: 1 },
            { u: "B", v: "D", w: 2 },
            { u: "C", v: "E", w: 3 },
            { u: "D", v: "E", w: 1 },
            { u: "E", v: "F", w: 2 },
        ];
        setNodes(exampleNodes);
        setEdges(exampleEdges);
        setSource("A");
        setDistances({});
        setHighlight(null);
        setNumNodes(6);
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center p-6">
            <Toaster position="top-center" />
            <h1 className="text-4xl font-extrabold mb-6 text-emerald-400 drop-shadow-lg">
                Bellman–Ford Visualizer 🚀
            </h1>

            <div className="flex gap-4 mb-4">
                <input
                    type="number"
                    min={2}
                    max={12}
                    placeholder="Number of nodes"
                    value={numNodes}
                    onChange={(e) => setNumNodes(parseInt(e.target.value))}
                    className="p-2 rounded-lg text-purple-900 bg-gray-100"
                />
                <button
                    onClick={handleGenerateNodes}
                    className="bg-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-500 transition"
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
                                className="px-4 py-2 border rounded-lg bg-gray-800 cursor-pointer text-white font-bold"
                            >
                                {n}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 ">
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
                        <input
                            type="number"
                            placeholder="Weight"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="p-2 rounded-lg text-gray-900 bg-white"
                        />
                        <button
                            onClick={handleAddEdge}
                            className="bg-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-500 transition"
                        >
                            Add/Edit Edge
                        </button>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleStart}
                            disabled={isRunning}
                            className={`${isRunning ? "bg-emerald-800" : "bg-emerald-600 hover:bg-emerald-500"
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

            {/* <BellmanFordVisualizer
                nodes={nodes}
                edges={edges}
                distances={distances}
                highlight={highlight}
            /> */}
            <GraphVisualizer
                nodes={nodes}
                edges={edges}
                distances={distances}
                highlight={highlight}
            />

        </div>
    );
}
