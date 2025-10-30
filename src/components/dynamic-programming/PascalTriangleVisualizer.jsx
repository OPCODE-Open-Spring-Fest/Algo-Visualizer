import React, { useState, useMemo, useEffect, useRef } from "react";
import {
    pascalTriangleTopDown,
    pascalTriangleBottomUp,
} from "../../algorithms/dynamic-programming/pascalTriangle";

// Component to render Pascal’s Triangle visually
const PascalTriangleGrid = ({ array, currentPosition }) => {
    return (
        <div className="mt-4 flex flex-col items-center gap-2">
            {array.map((row, rIdx) => (
                <div key={rIdx} className="flex justify-center gap-2">
                    {row.map((value, cIdx) => {
                        const isActive =
                            currentPosition &&
                            currentPosition.row === rIdx &&
                            currentPosition.col === cIdx;

                        return (
                            <div
                                key={cIdx}
                                className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ease-in-out text-lg font-semibold
                                    ${isActive
                                        ? "bg-blue-600 border-blue-400 text-white shadow-lg scale-110"
                                        : "bg-gray-700 border-gray-600 text-gray-200 hover:border-gray-500"
                                    }`}
                                title={`pascal(${rIdx}, ${cIdx})`}
                            >
                                {value === null || value === 0 ? "?" : value}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

// Playback speeds
const SPEED_OPTIONS = {
    Slow: 1500,
    Medium: 600,
    Fast: 200,
};

export default function PascalTriangleVisualizer() {
    const [n, setN] = useState(5);
    const [algorithm, setAlgorithm] = useState("topDown");
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(SPEED_OPTIONS.Medium);
    const timerRef = useRef(null);

    // --- Core Logic ---

    const handleCompute = () => {
        if (n < 0 || n > 10) {
            alert("Please enter N between 0 and 10 for clear visualization.");
            return;
        }

        setIsPlaying(false);

        const { steps: newSteps } =
            algorithm === "topDown"
                ? pascalTriangleTopDown(n)
                : pascalTriangleBottomUp(n);

        setSteps(newSteps);
        setCurrentStep(0);
    };

    useEffect(() => {
        handleCompute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [n, algorithm]);

    // Auto-Play Logic
    useEffect(() => {
        if (isPlaying && currentStep < steps.length - 1) {
            timerRef.current = setInterval(() => {
                setCurrentStep((prev) => prev + 1);
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
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    const handleNext = () => {
        setIsPlaying(false);
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        setIsPlaying(false);
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const currentState = useMemo(
        () => steps[currentStep] || {},
        [steps, currentStep]
    );

    const isFinalStep = steps.length > 0 && currentStep === steps.length - 1;

    return (
        <div className="p-6 min-h-screen bg-gray-900 text-gray-100 font-sans">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-8 text-indigo-400 text-center drop-shadow-lg">
                    Pascal’s Triangle
                </h1>

                {/* Concept Section */}
                <details className="mb-8 p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-inner group">
                    <summary className="cursor-pointer text-xl font-bold text-teal-400 hover:text-teal-300 transition-colors">
                        What is Pascal’s Triangle?
                    </summary>
                    <div className="mt-3 p-3 border-t border-gray-700 text-gray-300">
                        <p className="mb-2">
                            Pascal’s Triangle is a triangular array of numbers
                            where each entry is the sum of the two numbers
                            directly above it. The outer edges are always 1.
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>
                                <b>Top-Down (Memoization):</b> Recursive
                                approach that computes each cell using previously
                                stored results.
                            </li>
                            <li>
                                <b>Bottom-Up (Tabulation):</b> Iterative
                                approach that fills the triangle row by row.
                            </li>
                        </ul>
                    </div>
                </details>

                {/* Controls */}
                <div className="flex flex-wrap justify-center items-center gap-5 mb-8 p-6 rounded-xl bg-gray-800 shadow-2xl border border-gray-700">
                    <div className="flex items-center gap-3">
                        <label htmlFor="n-value" className="text-gray-300 text-lg">
                            Rows (N):
                        </label>
                        <input
                            id="n-value"
                            type="number"
                            min="0"
                            max="10"
                            className="border border-gray-600 p-2 rounded-lg w-24 bg-gray-700 text-white text-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={n}
                            onChange={(e) =>
                                setN(Math.max(0, Math.min(10, Number(e.target.value))))
                            }
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="algorithm-select"
                            className="text-gray-300 text-lg"
                        >
                            Algorithm:
                        </label>
                        <select
                            id="algorithm-select"
                            className="border border-gray-600 p-2 rounded-lg bg-gray-700 text-white text-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={algorithm}
                            onChange={(e) => setAlgorithm(e.target.value)}
                        >
                            <option value="topDown">Top-Down (Memoization)</option>
                            <option value="bottomUp">Bottom-Up (Tabulation)</option>
                        </select>
                    </div>

                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition duration-300 ease-in-out shadow-md transform hover:-translate-y-0.5"
                        onClick={handleCompute}
                    >
                        Re-Visualize
                    </button>
                </div>

                {/* Visualization */}
                {steps.length > 0 ? (
                    <>
                        <div className="flex flex-wrap justify-between items-center mb-6 p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-lg">
                            <button
                                className={`px-5 py-2 rounded-lg font-semibold text-lg transition duration-200 transform hover:scale-105 ${isPlaying
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-green-600 hover:bg-green-700"
                                    } text-white shadow-md`}
                                onClick={togglePlay}
                                disabled={isFinalStep && isPlaying}
                            >
                                {isFinalStep && !isPlaying
                                    ? "Replay"
                                    : isPlaying
                                        ? "Pause"
                                        : "Play"}
                            </button>

                            <div className="flex gap-2">
                                <button
                                    className={`px-3 py-2 rounded-lg font-semibold ${currentStep > 0
                                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                        }`}
                                    onClick={handlePrev}
                                    disabled={currentStep === 0}
                                >
                                    &lt; Prev
                                </button>
                                <button
                                    className={`px-3 py-2 rounded-lg font-semibold ${currentStep < steps.length - 1
                                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                        }`}
                                    onClick={handleNext}
                                    disabled={currentStep === steps.length - 1}
                                >
                                    Next &gt;
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <label
                                    htmlFor="speed-select"
                                    className="text-gray-300"
                                >
                                    Speed:
                                </label>
                                <select
                                    id="speed-select"
                                    className="border border-gray-600 p-2 rounded-lg bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
                                    value={speed}
                                    onChange={(e) => setSpeed(Number(e.target.value))}
                                >
                                    {Object.entries(SPEED_OPTIONS).map(
                                        ([label, ms]) => (
                                            <option key={label} value={ms}>
                                                {label}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* Step Counter */}
                        <div className="text-center mb-4">
                            <p className="text-2xl font-bold text-yellow-400">
                                Step {currentStep + 1} / {steps.length}
                            </p>
                        </div>

                        <div className="border border-gray-700 p-6 rounded-xl bg-gray-800 shadow-2xl">
                            <div className="mb-6 p-4 rounded-lg bg-gray-700 border-l-4 border-teal-400 shadow-inner">
                                <p className="text-teal-400 font-medium text-md uppercase tracking-wide">
                                    Current Action
                                </p>
                                <p className="text-xl mt-2 text-gray-200 leading-relaxed">
                                    {currentState.message || "Starting computation..."}
                                </p>
                            </div>

                            {currentState.array && (
                                <PascalTriangleGrid
                                    array={currentState.array}
                                    currentPosition={currentState.currentPosition}
                                />
                            )}

                            {isFinalStep && (
                                <div className="mt-8 p-5 rounded-xl bg-green-900 border border-green-700 text-center shadow-lg">
                                    <p className="text-green-400 text-2xl font-extrabold">
                                        Pascal’s Triangle of size {n} computed successfully.
                                    </p>
                                </div>
                            )}

                            <details className="mt-8 text-sm text-gray-400">
                                <summary className="cursor-pointer hover:text-gray-200 text-md font-medium">
                                    Click to View Raw Step Data (for debugging)
                                </summary>
                                <pre className="bg-gray-900 p-4 rounded-lg mt-3 overflow-auto text-xs border border-gray-700 shadow-inner max-h-60">
                                    {JSON.stringify(currentState, null, 2)}
                                </pre>
                            </details>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-12 bg-gray-800 rounded-xl text-gray-400 text-xl shadow-xl border border-gray-700">
                        <p className="mb-4">
                            Welcome to the Pascal’s Triangle Dynamic Programming Visualizer.
                        </p>
                        <p>
                            Enter the number of rows and choose an algorithm above to begin.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
