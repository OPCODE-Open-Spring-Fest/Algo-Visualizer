import React, { useState, useEffect, useRef } from "react";
import { generatePermutations } from "@/algorithms/Recursion/permutation";

export default function PermutationsVisualizer() {
  const [inputText, setInputText] = useState("A,B,C");
  const [array, setArray] = useState(["A", "B", "C"]);
  const [steps, setSteps] = useState([]);
  const [permutations, setPermutations] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);

  const timerRef = useRef(null);

  useEffect(() => {
    const arr = inputText.split(",").map(x => x.trim()).filter(Boolean);
    setArray(arr.length ? arr : []);
  }, [inputText]);

  useEffect(() => {
    if (!playing) return;
    if (index >= steps.length) {
      setPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => {
      setIndex(i => Math.min(i + 1, steps.length));
    }, speed);

    return () => clearTimeout(timerRef.current);
  }, [playing, index, steps.length, speed]);

  function build() {
    const arr = inputText.split(",").map(x => x.trim()).filter(Boolean);
    const { steps: s, permutations: p } = generatePermutations(arr);

    setSteps(s);
    setPermutations(p);
    setIndex(0);
    setPlaying(false);
  }

  function stepForward() {
    setIndex(i => Math.min(i + 1, steps.length));
  }

  function stepBackward() {
    setIndex(i => Math.max(i - 1, 0));
  }

  function reset() {
    setIndex(0);
    setPlaying(false);
  }

  const currentStep = index > 0 ? steps[index - 1] : null;
  const displayedArray = currentStep ? currentStep.array : array;

  let highlight = { i: null, j: null };
  let status = "Idle";
  let depth = currentStep ? currentStep.depth : "-";

  if (currentStep) {
    if (["swap", "backtrack"].includes(currentStep.type)) {
      highlight.i = currentStep.i;
      highlight.j = currentStep.j;
      status =
        currentStep.type === "swap"
          ? `Swap ${currentStep.i} ↔ ${currentStep.j}`
          : `Backtrack ${currentStep.i} ↔ ${currentStep.j}`;
    } else if (currentStep.type === "recurse") {
      status = `Recurse → index ${currentStep.index}`;
    } else if (currentStep.type === "output") {
      status = "Output permutation";
    } else if (currentStep.type === "start") {
      status = "Start";
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 p-6 flex justify-center">
      <div className="w-full max-w-5xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Permutations Visualizer (Recursion)
        </h2>

        {/* INPUT CARD */}
        <div className="bg-[#1a1a1a] p-5 rounded-2xl shadow-lg border border-gray-800 mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-300">
            Enter Elements (comma separated)
          </label>
          <input
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 focus:border-blue-500 outline-none text-gray-200"
            placeholder="A,B,C"
          />

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={build}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              Build
            </button>

            <button
              onClick={() => setPlaying(p => !p)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
            >
              {playing ? "Pause" : "Play"}
            </button>

            <button
              onClick={stepBackward}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              ◀ Step
            </button>

            <button
              onClick={stepForward}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Step ▶
            </button>

            <button
              onClick={reset}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Reset
            </button>

            <div className="flex items-center gap-3 ml-auto">
              <label className="text-sm text-gray-400">Speed</label>
              <input
                type="range"
                min="50"
                max="1500"
                value={speed}
                onChange={e => setSpeed(Number(e.target.value))}
              />
              <span className="text-xs">{speed}ms</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-[#1a1a1a] p-5 rounded-2xl shadow-md border border-gray-800">
            <h3 className="text-lg font-semibold text-blue-300">Array State</h3>

            <div className="flex gap-3 mt-4">
              {displayedArray.map((v, i) => (
                <div
                  key={i}
                  className={`px-4 py-3 bg-[#111] border rounded-xl text-xl shadow 
                    transition-all duration-200 
                    ${
                      i === highlight.i || i === highlight.j
                        ? "bg-yellow-500 text-black scale-110"
                        : "border-gray-700"
                    }`}
                >
                  {v}
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-300 space-y-1">
              <div><strong>Step:</strong> {index} / {steps.length}</div>
              <div><strong>Status:</strong> {status}</div>
              <div><strong>Depth:</strong> {depth}</div>
            </div>
          </div>
          <div className="bg-[#1a1a1a] p-5 rounded-2xl shadow-md border border-gray-800">
            <h3 className="text-lg font-semibold text-green-300">Generated Permutations</h3>

            <div className="mt-4 flex flex-col gap-2 max-h-64 overflow-auto pr-2">
              {permutations.map((p, i) => (
                <div key={i} className="text-sm bg-[#111] border border-gray-700 p-2 rounded-lg">
                  {p.join(", ")}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 bg-[#1a1a1a] p-5 rounded-2xl shadow-md border border-gray-800 max-h-60 overflow-auto">
          <h3 className="text-lg font-semibold text-purple-300 mb-3">All Steps</h3>

          {steps.map((s, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg mb-1 transition 
                ${
                  i === index - 1
                    ? "bg-[#333] border-l-4 border-blue-500"
                    : "bg-[#111]"
                }`}
            >
              <strong>{i + 1}.</strong> {s.type} — [{s.array.join(", ")}] (depth {s.depth})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
