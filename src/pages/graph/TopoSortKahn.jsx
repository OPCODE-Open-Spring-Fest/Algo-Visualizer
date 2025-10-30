import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import TopoGraph from "../../components/graph/TopoSortKahnVisualizer"; 

//  Topological Sort generator (Kahn's Algorithm)
function* topologicalSort(nodes, edges) {
    const inDegree = {};
    const adjList = {};

    // Initialize graph
    nodes.forEach((n) => {
        inDegree[n] = 0;
        adjList[n] = [];
    });

    // Build graph
    for (let { u, v } of edges) {
        adjList[u].push(v);
        inDegree[v]++;
    }

    const queue = nodes.filter((n) => inDegree[n] === 0);
    const topoOrder = [];

    // Initial enqueue state
    yield {
        type: "init",
        queue: [...queue],
        inDegree: { ...inDegree },
        topoOrder: [],
    };

    while (queue.length > 0) {
        const current = queue.shift();
        topoOrder.push(current);

        yield {
            type: "visit",
            node: current,
            queue: [...queue],
            inDegree: { ...inDegree },
            topoOrder: [...topoOrder],
        };

        for (const neighbor of adjList[current]) {
            inDegree[neighbor]--;
            yield {
                type: "decrement",
                from: current,
                to: neighbor,
                inDegree: { ...inDegree },
            };
            if (inDegree[neighbor] === 0) {
                queue.push(neighbor);
                yield {
                    type: "enqueue",
                    node: neighbor,
                    queue: [...queue],
                    inDegree: { ...inDegree },
                };
            }
        }
    }

    if (topoOrder.length !== nodes.length) {
        yield {
            type: "cycle",
            message: "Graph has a cycle. Topological sort not possible!",
        };
        return;
    }

    yield { type: "done", topoOrder };
}

//  Main Component
export default function KahnTopologicalSort() {
    const [numNodes, setNumNodes] = useState(0);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [highlight, setHighlight] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [topoOrder, setTopoOrder] = useState([]);
    const [inDegree, setInDegree] = useState({});
    const [queue, setQueue] = useState([]);

    // Edge input state
    const [fromNode, setFromNode] = useState("");
    const [toNode, setToNode] = useState("");

    // Generate nodes
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

    // Add edge
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

    // Run Topological Sort visualization
    const handleStart = async () => {
        if (isRunning) return;
        if (nodes.length === 0 || edges.length === 0) {
            toast.error("Please generate nodes and edges first!");
            return;
        }

        setIsRunning(true);
        const gen = topologicalSort(nodes, edges);
        for (let step of gen) {
            setHighlight(step);
            if (step.inDegree) setInDegree(step.inDegree);
            if (step.queue) setQueue(step.queue);
            if (step.topoOrder) setTopoOrder(step.topoOrder);

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
        setInDegree({});
        setQueue([]);
    };

    // Load example DAG
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
            <h1 className="text-4xl font-extrabold mb-6 text-yellow-400 drop-shadow-lg">
                Topological Sort Visualizer 
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
                    className="bg-yellow-600 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
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
                            className="bg-yellow-600 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
                        >
                            Add Edge
                        </button>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleStart}
                            disabled={isRunning}
                            className={`${isRunning
                                ? "bg-yellow-800"
                                : "bg-yellow-600 hover:bg-yellow-500"
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
                inDegree={inDegree}
                queue={queue}
                highlight={highlight}
                topoOrder={topoOrder}
            />
        </div>
    );
}
