// src/pages/graph/UnionFind.jsx
import { useState } from "react";
import UnionFindVisualizer from "../../components/graph/UnionFindVisualizer";
import { UnionFind } from "../../algorithms/graph/unionFind";

export default function UnionFindPage() {
    const [nodes, setNodes] = useState([]);
    const [uf, setUf] = useState(null);
    const [highlights, setHighlights] = useState({
        current: null,
        root: null,
        union: [],
    });
    const [x, setX] = useState("");
    const [y, setY] = useState("");

    const addNode = () => {
        const newNodes = [...nodes, nodes.length];
        setNodes(newNodes);
        setUf(new UnionFind(newNodes.length));
    };

    const reset = () => {
        setNodes([]);
        setUf(null);
        setHighlights({ current: null, root: null, union: [] });
        setX("");
        setY("");
    };

    const handleUnion = async () => {
        if (!uf || x === "" || y === "") return;
        uf.steps = [];
        uf.union(Number(x), Number(y));
        await visualizeSteps(uf.getSteps());
    };

    const handleFind = async () => {
        if (!uf || x === "") return;
        uf.steps = [];
        uf.find(Number(x));
        await visualizeSteps(uf.getSteps());
    };

    const visualizeSteps = async (steps) => {
        for (const step of steps) {
            if (step.type === "find-start") {
                setHighlights({ current: step.node, root: null, union: [] });
            } else if (step.type === "find-end") {
                setHighlights({ current: step.node, root: step.root, union: [] });
            } else if (step.type.includes("union")) {
                setHighlights({ current: null, root: step.parent, union: [step.child] });
            }
            await new Promise((r) => setTimeout(r, 700));
            setHighlights({ current: null, root: null, union: [] });
        }
    };

    return (
        <div className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">🔗 Union-Find Visualizer</h1>

            <div className="flex justify-center gap-3 mb-4">
                <input
                    type="number"
                    placeholder="x"
                    value={x}
                    onChange={(e) => setX(e.target.value)}
                    className="border rounded px-3 py-1 w-16"
                />
                <input
                    type="number"
                    placeholder="y"
                    value={y}
                    onChange={(e) => setY(e.target.value)}
                    className="border rounded px-3 py-1 w-16"
                />
                <button
                    onClick={addNode}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                    Add Node
                </button>
                <button
                    onClick={handleUnion}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                    Union
                </button>
                <button
                    onClick={handleFind}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                    Find
                </button>
                <button
                    onClick={reset}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                    Reset
                </button>
            </div>

            {uf && (
                <UnionFindVisualizer
                    nodes={nodes}
                    parent={uf.parent}
                    highlights={highlights}
                />
            )}
        </div>
    );
}
