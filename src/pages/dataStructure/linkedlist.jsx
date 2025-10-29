// src/pages/dataStructure/linkedlist.jsx
import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import LinkedListVisualizer from "../../components/dataStructure/linkedlist.jsx";
import { linkedListOp } from "../../algorithms/dataStructure/linkedlist.js";

export default function LinkedListPage() {
  const [array, setArray] = useState([]);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState("");
  const [variant, setVariant] = useState("singly"); // 'singly' | 'doubly' | 'circular'
  const [direction, setDirection] = useState("forward"); // for doubly traversal
  const [highlight, setHighlight] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const runAction = async (action) => {
    if (isRunning) return;
    setIsRunning(true);

    // attach variant/direction into action for generator logic
    action.variant = variant;
    action.direction = direction;

    const gen = linkedListOp([...array], action);
    for (let step of gen) {
      if (step.highlight && step.highlight.type === "error") {
        toast.error(step.message || "Operation failed");
        break;
      }
      setHighlight(step.highlight || null);
      if (step.array) setArray([...step.array]);
      // message shown as tiny toast (optional)
      if (step.message) {
        // small non-intrusive
        // toast.dismiss(); // keep minimal
      }
      await delay(450);
    }

    await delay(120);
    setHighlight(null);
    setIsRunning(false);
  };

  const handleInsertHead = async () => {
    if (!value.trim()) return toast.error("Enter a value to insert");
    await runAction({ type: "insertHead", value: value.trim() });
    setValue("");
    setIndex("");
  };

  const handleInsertTail = async () => {
    if (!value.trim()) return toast.error("Enter a value to insert");
    await runAction({ type: "insertTail", value: value.trim() });
    setValue("");
    setIndex("");
  };

  const handleInsertAt = async () => {
    if (!value.trim()) return toast.error("Enter a value to insert");
    const idx = index === "" ? array.length : Number(index);
    if (!Number.isInteger(idx) || idx < 0 || idx > array.length) return toast.error("Invalid index");
    await runAction({ type: "insertAt", index: idx, value: value.trim() });
    setValue("");
    setIndex("");
  };

  const handleDeleteHead = async () => {
    await runAction({ type: "deleteHead" });
  };

  const handleDeleteTail = async () => {
    await runAction({ type: "deleteTail" });
  };

  const handleDeleteValue = async () => {
    if (!value.trim()) return toast.error("Enter value to delete");
    await runAction({ type: "deleteValue", value: value.trim() });
    setValue("");
  };

  const handleTraverse = async () => {
    await runAction({ type: "traverse" });
  };

  const handleClear = async () => {
    await runAction({ type: "clear" });
  };

  const loadDemo = async () => {
    const demo = ["10", "20", "30", "40"];
    await runAction({ type: "loadDemo", demo });
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center p-4 sm:p-6">
      <Toaster position="top-center" />
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-indigo-400 drop-shadow-lg text-center">
        Linked List Visualizer ({variant})
      </h1>

      <div className="w-full max-w-3xl">
        <div className="bg-gray-900/40 rounded-lg p-4 sm:p-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              className="p-3 rounded bg-[#0b1220] border border-indigo-600 text-indigo-200"
            >
              <option value="singly">Singly</option>
              <option value="doubly">Doubly</option>
              <option value="circular">Circular</option>
            </select>

            {variant === "doubly" && (
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="p-3 rounded bg-[#0b1220] border border-indigo-600 text-indigo-200"
              >
                <option value="forward">Traverse: Forward</option>
                <option value="backward">Traverse: Backward</option>
              </select>
            )}

            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Value (text or number)"
              className="flex-1 border-2 border-indigo-500 bg-gray-900 text-indigo-200 rounded-lg p-3 text-center outline-none shadow-inner"
            />

            <input
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              placeholder="Index (optional)"
              className="w-28 border-2 border-indigo-500 bg-gray-900 text-indigo-200 rounded-lg p-3 text-center outline-none shadow-inner"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button onClick={handleInsertHead} disabled={isRunning} className={`px-4 py-2 rounded text-white font-semibold ${isRunning ? "bg-indigo-700 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"}`}>
              Insert Head
            </button>

            <button onClick={handleInsertTail} disabled={isRunning} className={`px-4 py-2 rounded text-white font-semibold ${isRunning ? "bg-indigo-700 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"}`}>
              Insert Tail
            </button>

            <button onClick={handleInsertAt} disabled={isRunning} className={`px-4 py-2 rounded text-white font-semibold ${isRunning ? "bg-indigo-700 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"}`}>
              Insert At
            </button>

            <button onClick={handleDeleteHead} disabled={isRunning} className={`px-4 py-2 rounded text-white font-semibold ${isRunning ? "bg-gray-700 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-500"}`}>
              Delete Head
            </button>

            <button onClick={handleDeleteTail} disabled={isRunning} className={`px-4 py-2 rounded text-white font-semibold ${isRunning ? "bg-gray-700 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-500"}`}>
              Delete Tail
            </button>

            <button onClick={handleDeleteValue} disabled={isRunning} className={`px-4 py-2 rounded text-white font-semibold ${isRunning ? "bg-gray-700 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-500"}`}>
              Delete Value
            </button>

            <button onClick={handleTraverse} disabled={isRunning} className={`px-4 py-2 rounded text-white font-semibold ${isRunning ? "bg-gray-700 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400"}`}>
              Traverse
            </button>

            <button onClick={handleClear} disabled={isRunning} className={`px-4 py-2 rounded text-white font-semibold ${isRunning ? "bg-gray-700 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-500"}`}>
              Clear
            </button>

            <button onClick={loadDemo} disabled={isRunning} className={`px-4 py-2 rounded text-white font-semibold ${isRunning ? "bg-purple-700 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-500"}`}>
              Load Demo
            </button>
          </div>
        </div>

        <div className="mt-6">
          <LinkedListVisualizer array={array} highlight={highlight} variant={variant} />
        </div>

        <div className="mt-4 text-sm text-slate-400 text-center">
          Tip: Head → Tail | Circular shows loop back arrow; Doubly shows backward arrows.
        </div>
      </div>
    </div>
  );
}
