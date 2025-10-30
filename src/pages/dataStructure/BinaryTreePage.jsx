// src/pages/dataStructure/BinaryTreePage.jsx
import React, { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import BinaryTreeVisualizer from "../../components/dataStructure/BinaryTreeVisualizer.jsx";
import { binaryTreeOp, resetIdCounter } from "../../algorithms/dataStructure/binarytree.js";

export default function BinaryTreePage() {
  const [treeSnapshot, setTreeSnapshot] = useState(null);
  const [nodesById, setNodesById] = useState({});
  const [value, setValue] = useState("");
  const [listInput, setListInput] = useState("");
  const [treeType, setTreeType] = useState("binary");
  const [traverseOrder, setTraverseOrder] = useState("inorder");
  const [highlight, setHighlight] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [stepCountLabel, setStepCountLabel] = useState("No actions yet");

  const genRef = useRef(null);
  const historyRef = useRef([]);
  const stepIndexRef = useRef(-1);
  const playDelay = useRef(550);
  const playLoop = useRef(false);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // Apply visualization step
  const applyStep = (step) => {
    if (!step) return;
    setTreeSnapshot(step.tree ?? null);
    setNodesById(step.nodesById ?? {});
    setHighlight(step.highlight ?? null);
    const idx = stepIndexRef.current;
    const len = historyRef.current.length;
    setStepCountLabel(idx >= 0 ? `Step ${idx + 1} / ${len}` : `Step 0 / ${len}`);
  };

  const moveToIndex = (idx) => {
    const h = historyRef.current;
    if (idx < 0) {
      stepIndexRef.current = -1;
      setTreeSnapshot(null);
      setNodesById({});
      setHighlight(null);
      setStepCountLabel("No actions yet");
      return;
    }
    if (idx < h.length) {
      stepIndexRef.current = idx;
      applyStep(h[idx]);
    }
  };

  const stepForward = async () => {
    if (isRunning) return;
    setIsRunning(true);
    try {
      const h = historyRef.current;
      if (stepIndexRef.current < h.length - 1) {
        stepIndexRef.current++;
        applyStep(h[stepIndexRef.current]);
      } else if (genRef.current) {
        const { value, done } = genRef.current.next();
        if (!done && value) {
          h.push(value);
          stepIndexRef.current = h.length - 1;
          applyStep(value);
        }
        if (done) genRef.current = null;
      }
    } finally {
      setIsRunning(false);
    }
  };

  const stepBack = () => {
    if (isRunning) return;
    if (stepIndexRef.current > 0) {
      stepIndexRef.current--;
      applyStep(historyRef.current[stepIndexRef.current]);
    }
  };

  const startPlay = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    playLoop.current = true;

    while (playLoop.current) {
      await stepForward();
      await delay(playDelay.current);
      if (!genRef.current && stepIndexRef.current >= historyRef.current.length - 1) {
        playLoop.current = false;
      }
    }
    setIsPlaying(false);
  };

  const pausePlay = () => {
    playLoop.current = false;
    setIsPlaying(false);
  };

  const resetAll = () => {
    pausePlay();
    genRef.current = null;
    historyRef.current = [];
    stepIndexRef.current = -1;
    setTreeSnapshot(null);
    setNodesById({});
    setHighlight(null);
    setStepCountLabel("No actions yet");
  };

  // 🔧 Main operation runner (fixed for immediate execution)
  const runAction = async (action) => {
    if (isRunning) return;
    setIsRunning(true);
    pausePlay();

    try {
      const startRoot = treeSnapshot || null;
      genRef.current = binaryTreeOp(startRoot, action);

      // Consume first step immediately
      const first = genRef.current.next();
      if (!first.done && first.value) {
        historyRef.current.push(first.value);
        stepIndexRef.current = historyRef.current.length - 1;
        applyStep(first.value);
      }

      // Consume rest automatically (no double-click)
      while (true) {
        const { value, done } = genRef.current.next();
        if (!done && value) {
          historyRef.current.push(value);
          stepIndexRef.current = historyRef.current.length - 1;
          applyStep(value);
          await delay(20);
        } else break;
      }

    } catch (err) {
      console.error("runAction error:", err);
      // Removed toast.error("Operation failed");
    } finally {
      setIsRunning(false);
    }
  };

  // --- Button Handlers ---
  const handleInsert = async () => {
    if (!value.trim()) return toast.error("Enter a value to insert");
    const v = isNaN(value) ? value : Number(value);
    await runAction({ type: "insert", value: v, treeType });
    setValue("");
  };

  const handleDelete = async () => {
    if (!value.trim()) return toast.error("Enter value to delete");
    const v = isNaN(value) ? value : Number(value);
    await runAction({ type: "delete", value: v, treeType });
    setValue("");
  };

  const handleSearch = async () => {
    if (!value.trim()) return toast.error("Enter value to search");
    const v = isNaN(value) ? value : Number(value);
    await runAction({ type: "search", value: v, treeType });
    setValue("");
  };

  const handleBuildTree = async () => {
    if (!listInput.trim()) return toast.error("Enter level-order list (e.g. 1,2,3,-1,4)");
    const parts = listInput.split(",").map((s) => s.trim());
    const normalized = parts.map((p) =>
      p === "" || p === "-1" ? null : isNaN(p) ? p : Number(p)
    );
    await runAction({ type: "buildTree", list: normalized, treeType });
  };

  const handleTraverse = async () => {
    await runAction({ type: "traverse", order: traverseOrder });
  };

  const handleLoadDemo = async () => {
    const demo = ["1","2","3","4","5","-1","6","7","-1","-1","-1"];
    const normalized = demo.map((v) => (v === "-1" ? null : (isNaN(v) ? v : Number(v))));
    await runAction({ type: "loadDemo", demo: normalized, treeType });
  };

  useEffect(() => () => (playLoop.current = false), []);

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col p-4 sm:p-6">
      <Toaster position="top-center" />
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-indigo-400 text-center">
        Binary Tree / BST Visualizer
      </h1>

      <div className="w-full max-w-6xl mx-auto flex gap-6">
        {/* Left Panel */}
        <div className="w-full max-w-sm bg-gray-900/40 rounded-lg p-4 sm:p-6 shadow-md">
          <div className="flex flex-col gap-3">
            <label className="text-sm text-slate-300 font-semibold">Tree Type</label>
            <select
              value={treeType}
              onChange={(e) => setTreeType(e.target.value)}
              className="p-3 rounded bg-[#0b1220] border border-indigo-600 text-indigo-200"
            >
              <option value="binary">Binary Tree (Level-order)</option>
              <option value="bst">Binary Search Tree (BST)</option>
            </select>

            <label className="text-sm text-slate-300 font-semibold mt-2">Node Value</label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Value (text or number)"
              className="p-3 rounded bg-[#0b1220] border border-indigo-600 text-indigo-200"
            />

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button onClick={handleInsert} disabled={isRunning}
                className="px-4 py-2 rounded text-white font-semibold bg-emerald-600 hover:bg-emerald-500">
                Add Node
              </button>
              <button onClick={handleDelete} disabled={isRunning}
                className="px-4 py-2 rounded text-white font-semibold bg-rose-600 hover:bg-rose-500">
                Delete Node
              </button>
            </div>

            <button onClick={handleSearch} disabled={isRunning}
              className="w-full px-4 py-2 rounded text-white font-semibold bg-yellow-500 hover:bg-yellow-400">
              Search Node
            </button>

            <div className="mt-3 border-t border-slate-800 pt-3">
              <label className="text-sm text-slate-300 font-semibold">Build Tree</label>
              <input
                value={listInput}
                onChange={(e) => setListInput(e.target.value)}
                placeholder="1,2,3,4,-1,-1,5"
                className="p-3 rounded bg-[#0b1220] border border-indigo-600 text-indigo-200"
              />
              <div className="mt-2 grid grid-cols-2 gap-3">
                <button onClick={handleBuildTree} disabled={isRunning}
                  className="px-4 py-2 rounded text-white font-semibold bg-purple-600 hover:bg-purple-500">
                  Build Tree
                </button>
                <button onClick={handleLoadDemo} disabled={isRunning}
                  className="px-4 py-2 rounded text-white font-semibold bg-cyan-600 hover:bg-cyan-500">
                  Load Demo
                </button>
              </div>
            </div>

            <div className="mt-3 border-t border-slate-800 pt-3">
              <label className="text-sm text-slate-300 font-semibold">Traversal</label>
              <select
                value={traverseOrder}
                onChange={(e) => setTraverseOrder(e.target.value)}
                className="p-3 rounded bg-[#0b1220] border border-indigo-600 text-indigo-200"
              >
                <option value="inorder">Inorder</option>
                <option value="preorder">Preorder</option>
                <option value="postorder">Postorder</option>
                <option value="levelorder">Level Order</option>
              </select>
              <button onClick={handleTraverse} disabled={isRunning}
                className="w-full mt-2 px-4 py-2 rounded text-white font-semibold bg-yellow-500 hover:bg-yellow-400">
                Traverse
              </button>
            </div>

            <div className="mt-3 border-t border-slate-800 pt-3">
              <label className="text-sm text-slate-300 font-semibold">Controls</label>
              <div className="flex gap-2 flex-wrap mt-2">
                <button onClick={() => startPlay()} disabled={isPlaying || isRunning}
                  className="px-3 py-2 rounded text-white font-semibold bg-indigo-600 hover:bg-indigo-500">
                  ▶ Start
                </button>
                <button onClick={() => (isPlaying ? pausePlay() : startPlay())}
                  disabled={isRunning}
                  className="px-3 py-2 rounded text-white font-semibold bg-gray-700 hover:bg-gray-600">
                  {isPlaying ? "⏸ Pause" : "⏯ Resume"}
                </button>
                <button onClick={() => stepForward()} disabled={isRunning}
                  className="px-3 py-2 rounded text-white font-semibold bg-indigo-600 hover:bg-indigo-500">
                  ⏭ Step
                </button>
                <button onClick={() => stepBack()} disabled={isRunning}
                  className="px-3 py-2 rounded text-white font-semibold bg-indigo-600 hover:bg-indigo-500">
                  ⏮ Back
                </button>
                <button onClick={() => resetAll()} disabled={isRunning}
                  className="px-3 py-2 rounded text-white font-semibold bg-gray-600 hover:bg-gray-500">
                  🔄 Reset
                </button>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-400">
              Note: Binary Tree builds / manual Add use level-order insertion. Use -1 for null nodes.
            </div>
          </div>
        </div>

        {/* Right visualizer */}
        <div className="flex-1 bg-gray-900/20 rounded-lg p-4 sm:p-6 shadow-inner">
          <BinaryTreeVisualizer tree={treeSnapshot} nodesById={nodesById} highlight={highlight} />
          <div className="mt-3 text-sm text-slate-400">{highlight?.message ?? stepCountLabel}</div>
        </div>
      </div>
    </div>
  );
}
