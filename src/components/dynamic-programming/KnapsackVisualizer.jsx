import React, { useState, useMemo, useEffect, useRef } from "react";
import { knapsackTopDown, knapsackBottomUp } from "../../algorithms/dynamic-programming/knapsackAlgo";

// Simple DP grid renderer for 2D dp/memo tables
const DPGrid = ({ array, currentIndex }) => {
    if (!Array.isArray(array) || array.length === 0) return null;

    const rows = array.length;
    const cols = array[0].length;

    return (
        <div className="mt-4 overflow-auto">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">DP Table</h3>
            <div className="inline-block border rounded-lg bg-gray-800 p-3">
                <table className="table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 border text-sm text-gray-300">i \ w</th>
                            {Array.from({ length: cols }).map((_, c) => (
                                <th key={c} className="p-2 border text-sm text-gray-300">{c}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {array.map((row, r) => (
                            <tr key={r} className="text-center">
                                <td className="p-2 border text-sm text-gray-300">{r}</td>
                                {row.map((cell, c) => {
                                    const isActive = currentIndex && currentIndex.i === r && currentIndex.w === c;
                                    return (
                                        <td
                                            key={c}
                                            className={`p-3 border w-20 h-12 align-middle ${isActive ? "bg-blue-600 text-white font-bold scale-105 transform" : "bg-gray-700 text-gray-200"}`}
                                        >
                                            {cell === null ? "?" : cell}
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

const SPEED_OPTIONS = {
    "Slow": 1500,
    "Medium": 500,
    "Fast": 200,
};

export default function KnapsackVisualizer() {
    const [weightsInput, setWeightsInput] = useState("3,4,2");
    const [valuesInput, setValuesInput] = useState("4,5,3");
    const [capacity, setCapacity] = useState(6);
    const [algorithm, setAlgorithm] = useState("topDown");
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(SPEED_OPTIONS["Medium"]);
    const timerRef = useRef(null);

    // Parse inputs
    const weights = useMemo(() => weightsInput.split(",").map(s => Number(s.trim())).filter(v => !Number.isNaN(v)), [weightsInput]);
    const values = useMemo(() => valuesInput.split(",").map(s => Number(s.trim())).filter(v => !Number.isNaN(v)), [valuesInput]);

    const handleCompute = () => {
        if (weights.length === 0 || values.length === 0) {
            alert("Please provide weights and values.");
            return;
        }
        if (weights.length !== values.length) {
            alert("Weights and values arrays must have the same length.");
            return;
        }
        if (capacity < 0 || capacity > 200) {
            alert("Please enter capacity between 0 and 200 for visualization.");
            return;
        }

        setIsPlaying(false);

        const { steps: newSteps, result } = algorithm === "topDown"
            ? knapsackTopDown(weights, values, capacity)
            : knapsackBottomUp(weights, values, capacity);

        setSteps(newSteps);
        setCurrentStep(0);
    };

    useEffect(() => {
        handleCompute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [algorithm]);

    useEffect(() => {
        if (isPlaying && currentStep < steps.length - 1) {
            timerRef.current = setInterval(() => {
                setCurrentStep(prev => prev + 1);
            }, speed);
        } else if (currentStep === steps.length - 1) {
            setIsPlaying(false);
        }

        return () => clearInterval(timerRef.current);
    }, [isPlaying, currentStep, steps.length, speed]);

    const togglePlay = () => {
        if (currentStep === steps.length - 1) {
            setCurrentStep(0);
            setIsPlaying(true);
        } else setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        setIsPlaying(false);
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        setIsPlaying(false);
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const currentState = useMemo(() => steps[currentStep] || {}, [steps, currentStep]);
    const isFinalStep = steps.length > 0 && currentStep === steps.length - 1;

    const finalResult = isFinalStep && currentState.array ? (
        // For bottom-up dp, result is dp[n][W] (last row, last col). For top-down memo, we may need to compute same.
        (() => {
            const arr = currentState.array;
            if (!Array.isArray(arr)) return null;
            const lastRow = arr[arr.length - 1];
            return Array.isArray(lastRow) ? lastRow[lastRow.length - 1] : null;
        })()
    ) : null;

    return (
        <div className="p-6 min-h-screen bg-gray-900 text-gray-100 font-sans">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-8 text-indigo-400 text-center drop-shadow-lg">Knapsack Variants</h1>

                <div className="mb-8 p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-inner group">
                    <p className="text-gray-300">This visualizer supports 0/1 Knapsack (Top-Down memoization and Bottom-Up tabulation). Provide comma-separated arrays for weights and values, and a capacity (W).</p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-5 mb-8 p-6 rounded-xl bg-gray-800 shadow-2xl border border-gray-700">
                    <div className="w-full md:w-1/3">
                        <label className="text-gray-300">Weights (comma separated):</label>
                        <input value={weightsInput} onChange={(e) => setWeightsInput(e.target.value)} className="w-full mt-2 p-2 rounded-lg bg-gray-700 text-white border border-gray-600" />
                    </div>

                    <div className="w-full md:w-1/3">
                        <label className="text-gray-300">Values (comma separated):</label>
                        <input value={valuesInput} onChange={(e) => setValuesInput(e.target.value)} className="w-full mt-2 p-2 rounded-lg bg-gray-700 text-white border border-gray-600" />
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-gray-300">Capacity (W):</label>
                        <input type="number" value={capacity} onChange={(e) => setCapacity(Math.max(0, Number(e.target.value)))} className="w-24 p-2 rounded-lg bg-gray-700 text-white border border-gray-600" />
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-gray-300">Algorithm:</label>
                        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="p-2 rounded-lg bg-gray-700 text-white border border-gray-600">
                            <option value="topDown">Top-Down (Memoization)</option>
                            <option value="bottomUp">Bottom-Up (Tabulation)</option>
                        </select>
                    </div>

                    <button onClick={handleCompute} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl">Re-Visualize</button>
                </div>

                {steps.length > 0 ? (
                    <>
                        <div className="flex flex-wrap justify-between items-center mb-6 p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-lg">
                            <button onClick={togglePlay} className={`px-5 py-2 rounded-lg font-semibold text-lg ${isPlaying ? "bg-red-600" : "bg-green-600"} text-white`}>{isFinalStep && !isPlaying ? "Replay ▶️" : isPlaying ? "Pause ⏸️" : "Play ▶️"}</button>

                            <div className="flex gap-2">
                                <button onClick={handlePrev} disabled={currentStep === 0} className={`px-3 py-2 rounded-lg font-semibold ${currentStep > 0 ? "bg-purple-600 text-white" : "bg-gray-600 text-gray-400"}`}>&lt; Prev</button>
                                <button onClick={handleNext} disabled={currentStep === steps.length - 1} className={`px-3 py-2 rounded-lg font-semibold ${currentStep < steps.length - 1 ? "bg-purple-600 text-white" : "bg-gray-600 text-gray-400"}`}>Next &gt;</button>
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-gray-300">Speed:</label>
                                <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="p-2 rounded-lg bg-gray-700 text-white border border-gray-600">
                                    {Object.entries(SPEED_OPTIONS).map(([label, ms]) => (
                                        <option key={label} value={ms}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="text-center mb-4">
                            <p className="text-2xl font-bold text-yellow-400">Step <b>{currentStep + 1}</b> / <b>{steps.length}</b></p>
                        </div>

                        <div className="border border-gray-700 p-6 rounded-xl bg-gray-800 shadow-2xl">
                            <div className="mb-6 p-4 rounded-lg bg-gray-700 border-l-4 border-teal-400 shadow-inner">
                                <p className="text-teal-400 font-medium text-md uppercase tracking-wide">Current Action</p>
                                <p className="text-xl mt-2 text-gray-200 leading-relaxed">{currentState.message || 'Starting computation...'}</p>
                            </div>

                            {currentState.array && (
                                <DPGrid array={currentState.array} currentIndex={currentState.currentIndex || currentState.index} />
                            )}

                            {isFinalStep && finalResult !== null && (
                                <div className="mt-8 p-5 rounded-xl bg-green-900 border border-green-700 text-center shadow-lg">
                                    <p className="text-green-400 text-2xl font-extrabold flex items-center justify-center gap-3">🎉 Final Result: Max Value = <span className="text-green-200 text-3xl">{finalResult}</span></p>
                                </div>
                            )}

                            <details className="mt-8 text-sm text-gray-400">
                                <summary className="cursor-pointer hover:text-gray-200 text-md font-medium">Click to View Raw Step Data (for debugging)</summary>
                                <pre className="bg-gray-900 p-4 rounded-lg mt-3 overflow-auto text-xs border border-gray-700 shadow-inner max-h-60">{JSON.stringify(currentState, null, 2)}</pre>
                            </details>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-12 bg-gray-800 rounded-xl text-gray-400 text-xl shadow-xl border border-gray-700">
                        <p className="mb-4">Welcome to the Knapsack Variants Visualizer!</p>
                        <p>Provide weights and values (comma-separated) and a capacity to start.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
