import React, { useState, useEffect, useRef } from "react";
import { longestCommonSubsequenceSteps } from "../../algorithms/dynamic-programming/longestCommonSubsequence";

const DPGrid = ({ dp, active, match, finalPath }) => {
  if (!dp || dp.length === 0) return null;

  return (
    <div className="mt-4 overflow-auto">
      <h3 className="text-xl font-semibold mb-3 text-blue-400">DP Table</h3>
      <div className="inline-block border rounded-lg bg-gray-800 p-3">
        <table className="border-collapse">
          <tbody>
            {dp.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => {
                  const isActive = active && active.i === i && active.j === j;
                  const isMatch = match && match.i === i && match.j === j;
                  const isFinal = finalPath?.some(p => p.i === i && p.j === j);
                  const color = isFinal
                    ? "bg-yellow-600"
                    : isMatch
                    ? "bg-green-600"
                    : isActive
                    ? "bg-blue-600"
                    : "bg-gray-700";

                  return (
                    <td
                      key={j}
                      className={`w-14 h-12 border text-center text-white ${color}`}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SPEEDS = { Slow: 1200, Medium: 600, Fast: 250 };

export default function LCSVisualizer() {
  const [a, setA] = useState("ABCBDAB");
  const [b, setB] = useState("BDCAB");
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(SPEEDS.Medium);
  const timer = useRef(null);

  const handleStart = () => {
    const s = longestCommonSubsequenceSteps(a, b);
    setSteps(s);
    setStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying && stepIndex < steps.length - 1) {
      timer.current = setInterval(() => {
        setStepIndex(i => i + 1);
      }, speed);
    } else clearInterval(timer.current);

    return () => clearInterval(timer.current);
  }, [isPlaying, stepIndex, steps.length, speed]);

  const togglePlay = () => {
    if (stepIndex === steps.length - 1) setStepIndex(0);
    setIsPlaying(!isPlaying);
  };

  const current = steps[stepIndex] || {};
  const finalLCS = stepIndex === steps.length - 1 ? current.sequence : "";

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-indigo-400 text-center">
          Longest Common Subsequence (LCS)
        </h1>

        <div className="mb-8 p-4 rounded-xl bg-gray-800 border border-gray-700">
          <p className="text-gray-300">
            This visualizer shows how the DP table for LCS is filled step by step and how the final sequence is reconstructed.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-5 mb-8 p-6 rounded-xl bg-gray-800 border border-gray-700">
          <div className="w-full md:w-1/3">
            <label className="text-gray-300">String A:</label>
            <input
              value={a}
              onChange={e => setA(e.target.value)}
              className="w-full mt-2 p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
            />
          </div>

          <div className="w-full md:w-1/3">
            <label className="text-gray-300">String B:</label>
            <input
              value={b}
              onChange={e => setB(e.target.value)}
              className="w-full mt-2 p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
            />
          </div>

          <button
            onClick={handleStart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl"
          >
            Start Visualization
          </button>
        </div>

        {steps.length > 0 ? (
          <>
            <div className="flex flex-wrap justify-between items-center mb-6 p-4 bg-gray-800 border border-gray-700 rounded-xl">
              <button
                onClick={togglePlay}
                className={`px-5 py-2 rounded-lg font-semibold ${
                  isPlaying ? "bg-red-600" : "bg-green-600"
                } text-white`}
              >
                {isPlaying ? "Pause ⏸️" : "Play ▶️"}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setStepIndex(i => Math.max(0, i - 1))}
                  className={`px-3 py-2 rounded-lg font-semibold ${
                    stepIndex > 0
                      ? "bg-purple-600 text-white"
                      : "bg-gray-600 text-gray-400"
                  }`}
                >
                  &lt; Prev
                </button>
                <button
                  onClick={() =>
                    setStepIndex(i =>
                      i < steps.length - 1 ? i + 1 : steps.length - 1
                    )
                  }
                  className={`px-3 py-2 rounded-lg font-semibold ${
                    stepIndex < steps.length - 1
                      ? "bg-purple-600 text-white"
                      : "bg-gray-600 text-gray-400"
                  }`}
                >
                  Next &gt;
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-gray-300">Speed:</label>
                <select
                  value={speed}
                  onChange={e => setSpeed(Number(e.target.value))}
                  className="p-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                >
                  {Object.entries(SPEEDS).map(([label, ms]) => (
                    <option key={label} value={ms}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center mb-4">
              <p className="text-2xl font-bold text-yellow-400">
                Step {stepIndex + 1} / {steps.length}
              </p>
            </div>

            <div className="border border-gray-700 p-6 rounded-xl bg-gray-800 shadow-2xl">
              <div className="mb-6 p-4 rounded-lg bg-gray-700 border-l-4 border-teal-400">
                <p className="text-teal-400 font-semibold uppercase">
                  Current Action
                </p>
                <p className="text-lg mt-2 text-gray-200 leading-relaxed">
                  {current.message || "Processing..."}
                </p>
              </div>

              {current.dp && (
                <DPGrid
                  dp={current.dp}
                  active={current.active}
                  match={current.match}
                  finalPath={current.finalPath}
                />
              )}

              {finalLCS && (
                <div className="mt-8 p-5 rounded-xl bg-green-900 border border-green-700 text-center shadow-lg">
                  <p className="text-green-400 text-2xl font-extrabold">
                    🎉 Final LCS ={" "}
                    <span className="text-green-200 text-3xl">{finalLCS}</span>
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center p-12 bg-gray-800 rounded-xl text-gray-400 text-xl border border-gray-700">
            <p className="mb-4">Welcome to the LCS Visualizer!</p>
            <p>Enter two strings and click “Start Visualization”.</p>
          </div>
        )}
      </div>
    </div>
  );
}
