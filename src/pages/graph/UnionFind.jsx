// src/pages/graph/UnionFind.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import UnionFindVisualizer from "../../components/graph/UnionFindVisualizer";
import UnionFind from "../../algorithms/graph/unionFind";
import { Info, Play, RotateCcw, Plus, ArrowRight, X, CheckCircle } from "lucide-react";

export default function UnionFindPage() {
    const [nodes, setNodes] = useState([]);
    const [uf, setUf] = useState(null);
    const [highlights, setHighlights] = useState({
        current: null,
        root: null,
        union: [],
        path: [],
    });
    const [x, setX] = useState("");
    const [y, setY] = useState("");
    const [operationLog, setOperationLog] = useState([]);
    const [currentOperation, setCurrentOperation] = useState("");
    const [showExplanation, setShowExplanation] = useState(true);
    const [findResult, setFindResult] = useState(null);
    const [showFindResult, setShowFindResult] = useState(false);

    const addNode = () => {
        const newNodes = [...nodes, nodes.length];
        setNodes(newNodes);
        setUf(new UnionFind(newNodes.length));
        setOperationLog(prev => [...prev, {
            type: "add",
            message: `Added node ${nodes.length}`,
            timestamp: new Date().toLocaleTimeString()
        }]);
    };

    const reset = () => {
        setNodes([]);
        setUf(null);
        setHighlights({ current: null, root: null, union: [], path: [] });
        setX("");
        setY("");
        setOperationLog([]);
        setCurrentOperation("");
        setFindResult(null);
        setShowFindResult(false);
    };

    const getPathToRoot = (node) => {
        if (!uf) return [];
        const path = [];
        let current = node;
        while (current !== uf.parent[current]) {
            path.push(current);
            current = uf.parent[current];
        }
        path.push(current); // Add the root
        return path;
    };

    const handleUnion = async () => {
        if (!uf || x === "" || y === "") return;
        if (Number(x) >= nodes.length || Number(y) >= nodes.length) {
            setOperationLog(prev => [...prev, {
                type: "error",
                message: `Invalid nodes! Please use nodes 0-${nodes.length - 1}`,
                timestamp: new Date().toLocaleTimeString()
            }]);
            return;
        }
        
        setCurrentOperation(`Union(${x}, ${y})`);
        setOperationLog(prev => [...prev, {
            type: "union-start",
            message: `Starting Union(${x}, ${y}) - merging sets containing nodes ${x} and ${y}`,
            timestamp: new Date().toLocaleTimeString()
        }]);
        
        uf.steps = [];
        uf.union(Number(x), Number(y));
        await visualizeSteps(uf.getSteps());
        
        setCurrentOperation("");
    };

    const handleFind = async () => {
        if (!uf || x === "") return;
        if (Number(x) >= nodes.length) {
            setOperationLog(prev => [...prev, {
                type: "error",
                message: `Invalid node! Please use nodes 0-${nodes.length - 1}`,
                timestamp: new Date().toLocaleTimeString()
            }]);
            return;
        }
        
        setCurrentOperation(`Find(${x})`);
        setOperationLog(prev => [...prev, {
            type: "find-start",
            message: `Starting Find(${x}) - finding root of node ${x}`,
            timestamp: new Date().toLocaleTimeString()
        }]);
        
        uf.steps = [];
        const root = uf.find(Number(x));
        await visualizeSteps(uf.getSteps());
        
        setOperationLog(prev => [...prev, {
            type: "find-result",
            message: `Find(${x}) = ${root} - root found!`,
            timestamp: new Date().toLocaleTimeString()
        }]);
        
        // Show result popup
        setFindResult({
            node: Number(x),
            root: root,
            path: getPathToRoot(Number(x))
        });
        setShowFindResult(true);
        
        setCurrentOperation("");
    };

    const visualizeSteps = async (steps) => {
        for (const step of steps) {
            if (step.type === "find-start") {
                setHighlights({ current: step.node, root: null, union: [], path: [] });
                setOperationLog(prev => [...prev, {
                    type: "step",
                    message: `Finding root of node ${step.node}...`,
                    timestamp: new Date().toLocaleTimeString()
                }]);
            } else if (step.type === "path-compression") {
                setHighlights({ current: step.node, root: null, union: [], path: [step.node] });
                setOperationLog(prev => [...prev, {
                    type: "step",
                    message: `Path compression: Node ${step.node} now points directly to root ${step.newParent}`,
                    timestamp: new Date().toLocaleTimeString()
                }]);
            } else if (step.type === "find-end") {
                setHighlights({ current: step.node, root: step.root, union: [], path: [] });
                setOperationLog(prev => [...prev, {
                    type: "step",
                    message: `Found root ${step.root} for node ${step.node}`,
                    timestamp: new Date().toLocaleTimeString()
                }]);
            } else if (step.type === "union-start") {
                setHighlights({ current: null, root: null, union: [], path: [] });
                setOperationLog(prev => [...prev, {
                    type: "step",
                    message: `Union: Root of ${step.x} is ${step.rootX}, Root of ${step.y} is ${step.rootY}`,
                    timestamp: new Date().toLocaleTimeString()
                }]);
            } else if (step.type === "same-set") {
                setHighlights({ current: null, root: null, union: [], path: [] });
                setOperationLog(prev => [...prev, {
                    type: "step",
                    message: `Nodes ${step.x} and ${step.y} are already in the same set!`,
                    timestamp: new Date().toLocaleTimeString()
                }]);
            } else if (step.type === "union") {
                setHighlights({ current: null, root: step.parent, union: [step.child], path: [] });
                setOperationLog(prev => [...prev, {
                    type: "step",
                    message: `Merging: Node ${step.child} now points to root ${step.parent}`,
                    timestamp: new Date().toLocaleTimeString()
                }]);
            } else if (step.type === "union-rank") {
                setHighlights({ current: null, root: step.parent, union: [step.child], path: [] });
                setOperationLog(prev => [...prev, {
                    type: "step",
                    message: `Merging with rank increase: Node ${step.child} → ${step.parent} (rank increased)`,
                    timestamp: new Date().toLocaleTimeString()
                }]);
            }
            
            await new Promise((r) => setTimeout(r, 1000));
            setHighlights({ current: null, root: null, union: [], path: [] });
        }
    };

    return (
        <div className="min-h-screen w-full text-white flex flex-col items-center overflow-x-hidden relative">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#1b0b3a] via-[#120a2a] to-black animate-gradient-x bg-[length:400%_400%] -z-20" />
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm -z-10" />
            
            <div className="w-full max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold mb-4 text-white flex items-center justify-center gap-3">
                        🔗 Union-Find Visualizer
                    </h1>
                    <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-6">
                        Learn how the Union-Find data structure works! This powerful algorithm helps manage disjoint sets efficiently.
                    </p>
                    
                    {/* Toggle Explanation */}
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="flex items-center gap-2 mx-auto px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg border border-indigo-400/30 transition-colors"
                    >
                        <Info size={18} />
                        {showExplanation ? "Hide" : "Show"} Algorithm Explanation
                    </button>
                </div>

                {/* Algorithm Explanation */}
                {showExplanation && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-indigo-300">📚 What is Union-Find?</h2>
                        <div className="grid md:grid-cols-2 gap-6 text-gray-300">
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-white">Purpose:</h3>
                                <ul className="space-y-2 text-sm">
                                    <li>• Manages disjoint sets efficiently</li>
                                    <li>• Supports two main operations: Union and Find</li>
                                    <li>• Used in Kruskal's MST algorithm, cycle detection</li>
                                    <li>• Optimized with path compression and union by rank</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-white">Operations:</h3>
                                <ul className="space-y-2 text-sm">
                                    <li>• <span className="text-green-400">Find(x)</span>: Find the root of element x</li>
                                    <li>• <span className="text-blue-400">Union(x,y)</span>: Merge sets containing x and y</li>
                                    <li>• <span className="text-yellow-400">Path Compression</span>: Flatten the tree structure</li>
                                    <li>• <span className="text-purple-400">Union by Rank</span>: Attach smaller tree to larger</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Controls Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                                <Play size={20} />
                                Controls
                            </h3>
                            
                            {/* Current Operation */}
                            {currentOperation && (
                                <div className="mb-4 p-3 bg-indigo-500/20 rounded-lg border border-indigo-400/30">
                                    <p className="text-sm text-indigo-300">Currently executing:</p>
                                    <p className="font-mono text-indigo-200">{currentOperation}</p>
                                </div>
                            )}

                            {/* Input Fields */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Node X (for Find/Union)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter node number"
                                        value={x}
                                        onChange={(e) => setX(e.target.value)}
                                        className="w-full border border-gray-400 rounded px-4 py-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Node Y (for Union only)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter node number"
                                        value={y}
                                        onChange={(e) => setY(e.target.value)}
                                        className="w-full border border-gray-400 rounded px-4 py-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={addNode}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={18} />
                                    Add Node ({nodes.length})
                                </button>
                                
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={handleFind}
                                        disabled={!uf || x === ""}
                                        className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
                                    >
                                        Find Root
                                    </button>
                                    <button
                                        onClick={handleUnion}
                                        disabled={!uf || x === "" || y === ""}
                                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
                                    >
                                        Union Sets
                                    </button>
                                </div>
                                
                                <button
                                    onClick={reset}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                    <RotateCcw size={18} />
                                    Reset All
                                </button>
                            </div>

                            {/* Legend */}
                            <div className="mt-6 pt-4 border-t border-white/20">
                                <h4 className="text-sm font-semibold text-white mb-3">Color Legend:</h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                        <span>Currently processing</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                        <span>Root node</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                        <span>Being unioned</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                                        <span>Regular node</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visualizer and Log */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Visualizer */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold mb-4 text-white">Visual Representation</h3>
                            {nodes.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <p className="text-lg mb-2">No nodes yet!</p>
                                    <p className="text-sm">Click "Add Node" to start visualizing</p>
                                </div>
                            ) : (
                                <UnionFindVisualizer
                                    nodes={nodes}
                                    parent={uf?.parent || []}
                                    highlights={highlights}
                                />
                            )}
                        </div>

                        {/* Operation Log */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                                <ArrowRight size={20} />
                                Operation Log
                            </h3>
                            <div className="max-h-64 overflow-y-auto space-y-2">
                                {operationLog.length === 0 ? (
                                    <p className="text-gray-400 text-center py-4">No operations yet. Try adding nodes and performing operations!</p>
                                ) : (
                                    operationLog.map((log, index) => (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-lg text-sm ${
                                                log.type === "error" 
                                                    ? "bg-red-500/20 border border-red-400/30 text-red-200"
                                                    : log.type === "step"
                                                    ? "bg-indigo-500/20 border border-indigo-400/30 text-indigo-200"
                                                    : log.type === "find-result"
                                                    ? "bg-green-500/20 border border-green-400/30 text-green-200"
                                                    : "bg-gray-500/20 border border-gray-400/30 text-gray-200"
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className="font-mono">{log.message}</span>
                                                <span className="text-xs opacity-70 ml-2">{log.timestamp}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Find Result Popup */}
            {showFindResult && findResult && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Find Operation Complete!</h3>
                                    <p className="text-gray-300 text-sm">Root successfully found</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowFindResult(false)}
                                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-300" />
                            </button>
                        </div>

                        {/* Result Display */}
                        <div className="space-y-6">
                            {/* Main Result */}
                            <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                                <div className="text-center">
                                    <p className="text-gray-300 mb-2">The root of node</p>
                                    <div className="text-4xl font-bold text-white mb-2">{findResult.node}</div>
                                    <p className="text-gray-300 mb-4">is</p>
                                    <div className="text-5xl font-bold text-green-400 mb-2">{findResult.root}</div>
                                    <div className="text-sm text-gray-400">
                                        Find({findResult.node}) = {findResult.root}
                                    </div>
                                </div>
                            </div>

                            {/* Path Visualization */}
                            <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <ArrowRight className="w-5 h-5" />
                                    Path to Root
                                </h4>
                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                    {findResult.path.map((node, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                                index === 0 ? 'bg-blue-500' : 
                                                index === findResult.path.length - 1 ? 'bg-green-500' : 
                                                'bg-gray-600'
                                            }`}>
                                                {node}
                                            </div>
                                            {index < findResult.path.length - 1 && (
                                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-center text-sm text-gray-400">
                                    <span className="text-blue-400">Start</span> → 
                                    <span className="text-gray-400"> Intermediate nodes</span> → 
                                    <span className="text-green-400">Root</span>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                                <h4 className="text-lg font-semibold text-white mb-3">Algorithm Details</h4>
                                <div className="space-y-2 text-sm text-gray-300">
                                    <div className="flex justify-between">
                                        <span>Path Length:</span>
                                        <span className="text-white font-semibold">{findResult.path.length} nodes</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Time Complexity:</span>
                                        <span className="text-white font-semibold">O(α(n))</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Optimization:</span>
                                        <span className="text-white font-semibold">Path Compression</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => setShowFindResult(false)}
                                className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Got it!
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
