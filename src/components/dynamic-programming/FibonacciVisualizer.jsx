import React, { useState, useMemo, useEffect, useRef } from "react";
// Assuming fibonacciTopDown and fibonacciBottomUp are in this path and return the structured steps
import { fibonacciTopDown, fibonacciBottomUp } from "../../algorithms/dynamic-programming/fibonacciAlgo";

// Component to render the DP array visually
const DPArray = ({ array, currentIndex, algorithm }) => {
    const isMemoization = algorithm === "topDown";
    const label = isMemoization ? "Memo Table (F(i))" : "DP Array (F(i))";

    return (
        <div className="mt-4">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">{label}</h3>
            <div className="flex flex-wrap gap-2 justify-center">
                {array.map((value, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg text-center transition-all duration-300 ease-in-out border-2 w-20 flex flex-col justify-center items-center ${index === currentIndex
                            ? "bg-blue-600 border-blue-400 shadow-lg text-white font-bold transform scale-105"
                            : "bg-gray-700 border-gray-600 text-gray-200 hover:border-gray-500"
                            }`}
                        title={`F(${index})`}
                    >
                        <div className="text-sm font-light text-gray-400">F({index})</div>
                        <div className="text-xl mt-1">{value === null ? '?' : value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Playback speeds in milliseconds
const SPEED_OPTIONS = {
    "Slow": 1500,
    "Medium": 500,
    "Fast": 200,
};

export default function FibonacciVisualizer() {
    const [n, setN] = useState(10);
    const [algorithm, setAlgorithm] = useState("topDown");
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(SPEED_OPTIONS["Medium"]);
    const timerRef = useRef(null);

    // --- Core Logic ---

    // 1. Computation Logic
    const handleCompute = () => {
        if (n < 0 || n > 25) {
            alert("Please enter N between 0 and 25 for optimal visualization.");
            return;
        }

        setIsPlaying(false); // Stop playback on re-compute

        const { steps: newSteps } =
            algorithm === "topDown"
                ? fibonacciTopDown(n)
                : fibonacciBottomUp(n);

        setSteps(newSteps);
        setCurrentStep(0);
    };

    // Auto-compute on initial load or N/algorithm change
    useEffect(() => {
        handleCompute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [n, algorithm]);

    // 2. Auto-Play Logic
    useEffect(() => {
        if (isPlaying && currentStep < steps.length - 1) {
            timerRef.current = setInterval(() => {
                setCurrentStep((prevStep) => prevStep + 1);
            }, speed);
        } else if (currentStep === steps.length - 1) {
            // Stop playing when the last step is reached
            setIsPlaying(false);
        }

        return () => {
            clearInterval(timerRef.current);
        };
    }, [isPlaying, currentStep, steps.length, speed]);

    // --- Handlers ---

    const togglePlay = () => {
        if (currentStep === steps.length - 1) {
            // If at the end, reset to start and then play
            setCurrentStep(0);
            setIsPlaying(true);
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    const handleNext = () => {
        setIsPlaying(false); // Stop auto-play on manual step
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const handlePrev = () => {
        setIsPlaying(false); // Stop auto-play on manual step
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    // Memoized current state
    const currentState = useMemo(() => steps[currentStep] || {}, [steps, currentStep]);

    const isFinalStep = steps.length > 0 && currentStep === steps.length - 1;
    const finalResult = isFinalStep && currentState.array ? currentState.array[n] : null;

    return (
        <div className="p-6 min-h-screen bg-gray-900 text-gray-100 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-8 text-indigo-400 text-center drop-shadow-lg">
                    Fibonacci Sequence
                </h1>

                {/* Concept Dropdown */}
                <details className="mb-8 p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-inner group">
                    <summary className="cursor-pointer text-xl font-bold text-teal-400 hover:text-teal-300 transition-colors">
                        ❓ What is Fibonacci Sequence?
                    </summary>
                    <div className="mt-3 p-3 border-t border-gray-700 text-gray-300">
                        <p className="mb-2">
                            The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, usually starting with 0 and 1.
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>
                                <b>Top-Down (Memoization):</b>This is a recursive approach that solves the main problem first. It stores the results of subproblems in a <b>memo</b> (cache) as they are computed. <b>Think: solve, then save.</b>
                            </li>
                            <li>
                                <b>Bottom-Up (Tabulation):</b> This is an iterative approach that fills up a DP array (table) starting from the base cases (e.g., F(0) and F(1)). It builds the final solution from the smallest subproblems upwards. <b>Think: save, then solve.</b>
                            </li>
                        </ul>
                    </div>
                </details>

                {/* Controls Section (N, Algo, Re-Visualize) */}
                <div className="flex flex-wrap justify-center items-center gap-5 mb-8 p-6 rounded-xl bg-gray-800 shadow-2xl border border-gray-700">
                    {/* N Value */}
                    <div className="flex items-center gap-3">
                        <label htmlFor="n-value" className="text-gray-300 text-lg">N value:</label>
                        <input
                            id="n-value"
                            type="number"
                            min="0"
                            max="25"
                            className="border border-gray-600 p-2 rounded-lg w-24 bg-gray-700 text-white text-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            value={n}
                            onChange={(e) => setN(Math.max(0, Math.min(25, Number(e.target.value))))}
                        />
                    </div>

                    {/* Algorithm Select */}
                    <div className="flex items-center gap-3">
                        <label htmlFor="algorithm-select" className="text-gray-300 text-lg">Algorithm:</label>
                        <select
                            id="algorithm-select"
                            className="border border-gray-600 p-2 rounded-lg bg-gray-700 text-white text-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            value={algorithm}
                            onChange={(e) => setAlgorithm(e.target.value)}
                        >
                            <option value="topDown">Top-Down (Memoization)</option>
                            <option value="bottomUp">Bottom-Up (Tabulation)</option>
                        </select>
                    </div>

                    {/* Re-Visualize Button */}
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition duration-300 ease-in-out shadow-md transform hover:-translate-y-0.5"
                        onClick={handleCompute}
                    >
                        Re-Visualize
                    </button>
                </div>

                {/* Visualization Area */}
                {steps.length > 0 ? (
                    <>
                        <div className="flex flex-wrap justify-between items-center mb-6 p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-lg">
                            {/* Play/Pause Button */}
                            <button
                                className={`px-5 py-2 rounded-lg font-semibold text-lg transition duration-200 ease-in-out transform hover:scale-105 ${isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                                    } text-white shadow-md`}
                                onClick={togglePlay}
                                disabled={isFinalStep && isPlaying}
                            >
                                {isFinalStep && !isPlaying ? "Replay ▶️" : isPlaying ? "Pause ⏸️" : "Play ▶️"}
                            </button>

                            {/* Manual Controls */}
                            <div className="flex gap-2">
                                <button
                                    className={`px-3 py-2 rounded-lg font-semibold transition duration-150 ${currentStep > 0 ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
                                    onClick={handlePrev}
                                    disabled={currentStep === 0}
                                >
                                    &lt; Prev
                                </button>
                                <button
                                    className={`px-3 py-2 rounded-lg font-semibold transition duration-150 ${currentStep < steps.length - 1 ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
                                    onClick={handleNext}
                                    disabled={currentStep === steps.length - 1}
                                >
                                    Next &gt;
                                </button>
                            </div>

                            {/* Speed Control */}
                            <div className="flex items-center gap-2">
                                <label htmlFor="speed-select" className="text-gray-300">Speed:</label>
                                <select
                                    id="speed-select"
                                    className="border border-gray-600 p-2 rounded-lg bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
                                    value={speed}
                                    onChange={(e) => setSpeed(Number(e.target.value))}
                                >
                                    {Object.entries(SPEED_OPTIONS).map(([label, ms]) => (
                                        <option key={label} value={ms}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Step Counter */}
                        <div className="text-center mb-4">
                            <p className="text-2xl font-bold text-yellow-400">
                                Step <b>{currentStep + 1}</b> / <b>{steps.length}</b>
                            </p>
                        </div>


                        <div className="border border-gray-700 p-6 rounded-xl bg-gray-800 shadow-2xl">
                            {/* Current Action/Message */}
                            <div className="mb-6 p-4 rounded-lg bg-gray-700 border-l-4 border-teal-400 shadow-inner">
                                <p className="text-teal-400 font-medium text-md uppercase tracking-wide">Current Action</p>
                                <p className="text-xl mt-2 text-gray-200 leading-relaxed">
                                    {currentState.message || 'Starting computation...'}
                                </p>
                            </div>

                            {/* Visual DP Array */}
                            {currentState.array && (
                                <DPArray
                                    array={currentState.array}
                                    currentIndex={currentState.currentIndex}
                                    algorithm={algorithm}
                                />
                            )}

                            {/* Final Result Display */}
                            {isFinalStep && finalResult !== null && (
                                <div className="mt-8 p-5 rounded-xl bg-green-900 border border-green-700 text-center shadow-lg">
                                    <p className="text-green-400 text-2xl font-extrabold flex items-center justify-center gap-3">
                                        <span role="img" aria-label="confetti">🎉</span> Final Result: F({n}) = <span className="text-green-200 text-3xl">{finalResult}</span>
                                    </p>
                                </div>
                            )}

                            {/* Raw Data for Debug/Detail */}
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
                        <p className="mb-4">Welcome to the Fibonacci Dynamic Programming Visualizer!</p>
                        <p>Enter a <b>N</b> value (0-25) and select an <b>Algorithm</b> above.</p>
                        <p className="mt-2">The visualization will automatically start after you select a value.</p>
                    </div>
                )}
            </div>
        </div>
    );
}