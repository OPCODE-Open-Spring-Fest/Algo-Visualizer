import React, { useState, useMemo, useEffect, useRef } from "react";
import { getCountingSortSteps } from "../../algorithms/sorting/countingSort.js";

const ArrayDisplay = ({ title, array, highlightIndex = -1, readIndex = -1, indicesLabel = "Index" }) => {
    return (
        <div className="mt-4">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">{title}</h3>
            <div className="flex flex-wrap gap-2 justify-center">
                {array.map((value, index) => {
                    const isCurrent = index === highlightIndex;
                    const isReading = index === readIndex;

                    let cellClass = "bg-gray-700 border-gray-600 text-gray-200 hover:border-gray-500";
                    if (isCurrent) {
                        cellClass = "bg-blue-600 border-blue-400 shadow-lg text-white font-bold transform scale-105"; // Write/Current
                    } else if (isReading) {
                        cellClass = "bg-yellow-600 border-yellow-400 text-white"; // Read
                    }

                    return (
                        <div
                            key={index}
                            className={`p-3 rounded-lg text-center transition-all duration-300 ease-in-out border-2 w-20 flex flex-col justify-center items-center ${cellClass}`}
                            title={`${indicesLabel} ${index}`}
                        >
                            <div className="text-sm font-light text-gray-400">{indicesLabel} {index}</div>
                            <div className="text-xl mt-1">{value === null ? '?' : value}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const SPEED_OPTIONS = {
    "Slow": 1500,
    "Medium": 500,
    "Fast": 200,
};

export default function CountingSort() {
    const [input, setInput] = useState("4, 1, 3, 4, 0, 2, 1, 7");
    
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(SPEED_OPTIONS["Medium"]);
    const timerRef = useRef(null);

    const handleCompute = () => {
        const parsedArray = input
            .split(',')
            .map(s => Number(s.trim()))
            .filter(n => !isNaN(n) && n >= 0);

        if (parsedArray.length === 0 || parsedArray.length > 20) {
            alert("Please enter 1 to 20 non-negative numbers, separated by commas.");
            return;
        }

        const maxVal = Math.max(...parsedArray);
        if (maxVal > 50) {
            alert("The maximum value in the array must be 50 or less for optimal visualization.");
            return;
        }

        setIsPlaying(false);
        const { steps: newSteps } = getCountingSortSteps(parsedArray);
        setSteps(newSteps);
        setCurrentStep(0);
    };

    useEffect(() => {
        handleCompute();
    }, []);

    useEffect(() => {
        if (isPlaying && currentStep < steps.length - 1) {
            timerRef.current = setInterval(() => {
                setCurrentStep((prevStep) => prevStep + 1);
            }, speed);
        } else if (currentStep === steps.length - 1) {
            setIsPlaying(false);
        }

        return () => {
            clearInterval(timerRef.current);
        };
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

    const currentState = useMemo(() => steps[currentStep] || {}, [steps, currentStep]);
    const { phase, input: inputArray, count, output, highlight, message } = currentState;
    
    const isFinalStep = phase === 4;

    return (
        <div className="p-6 min-h-screen bg-gray-900 text-gray-100 font-sans">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-8 text-indigo-400 text-center drop-shadow-lg">
                    Counting Sort
                </h1>

                <details className="mb-8 p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-inner group">
                    <summary className="cursor-pointer text-xl font-bold text-teal-400 hover:text-teal-300 transition-colors">
                        ❓ What is Counting Sort?
                    </summary>
                    <div className="mt-3 p-3 border-t border-gray-700 text-gray-300">
                        <p className="mb-2">
                            Counting Sort is a non-comparison algorithm that sorts integers. It works in three phases:
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>
                                <b>Phase 1 (Frequency):</b> Count the occurrences of each unique element and store it in a `Count` array.
                            </li>
                            <li>
                                <b>Phase 2 (Cumulative Sum):</b> Modify the `Count` array so each element stores the sum of all previous counts. This gives the "ending position" of each element.
                            </li>
                            <li>
                                <b>Phase 3 (Output):</b> Iterate the `Input` array in reverse (for stability), place each element in its correct position in the `Output` array, and decrement its count.
                            </li>
                        </ul>
                    </div>
                </details>

                <div className="flex flex-col xl:flex-row justify-center items-center gap-5 mb-8 p-6 rounded-xl bg-gray-800 shadow-2xl border border-gray-700">
                    <div className="flex-1 w-full xl:w-auto">
                        <label htmlFor="input-array" className="text-gray-300 text-lg mb-2 block">Input Array (non-negative, max val 50):</label>
                        <input
                            id="input-array"
                            type="text"
                            className="border border-gray-600 p-2 rounded-lg w-full bg-gray-700 text-white text-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g., 4, 1, 3, 4, 0"
                        />
                    </div>
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition duration-300 ease-in-out shadow-md transform hover:-translate-y-0.5"
                        onClick={handleCompute}
                    >
                        Re-Visualize
                    </button>
                </div>

                {steps.length > 0 ? (
                    <>
                        <div className="flex flex-wrap justify-between items-center mb-6 p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-lg">
                            <button
                                className={`px-5 py-2 rounded-lg font-semibold text-lg transition duration-200 ease-in-out transform hover:scale-105 ${isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                                    } text-white shadow-md`}
                                onClick={togglePlay}
                                disabled={isFinalStep && isPlaying}
                            >
                                {isFinalStep && !isPlaying ? "Replay ▶️" : isPlaying ? "Pause ⏸️" : "Play ▶️"}
                            </button>
                            <div className="flex gap-2">
                                <button
                                    className={`px-3 py-2 rounded-lg font-semibold transition duration-150 ${currentStep > 0 ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
                                    onClick={handlePrev}
                                    disabled={currentStep === 0}
                                >
                                    &lt; Prev
                                </button>
                                <button
                                    className={`px-3 py-2 rounded-lg font-semibold transition duration-150 ${!isFinalStep ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
                                    onClick={handleNext}
                                    disabled={isFinalStep}
                                >
                                    Next &gt;
                                </button>
                            </div>
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

                        <div className="text-center mb-4">
                            <p className="text-2xl font-bold text-yellow-400">
                                Step <b>{currentStep + 1}</b> / <b>{steps.length}</b>
                                {phase && <span className="ml-4 text-xl text-teal-400">(Phase {phase} / 3)</span>}
                            </p>
                        </div>

                        <div className="border border-gray-700 p-6 rounded-xl bg-gray-800 shadow-2xl">
                            <div className="mb-6 p-4 rounded-lg bg-gray-700 border-l-4 border-teal-400 shadow-inner min-h-[100px]">
                                <p className="text-teal-400 font-medium text-md uppercase tracking-wide">Current Action</p>
                                <p className="text-xl mt-2 text-gray-200 leading-relaxed">
                                    {message || 'Starting computation...'}
                                </p>
                            </div>

                            <ArrayDisplay
                                title="Input Array"
                                array={inputArray}
                                highlightIndex={highlight.input}
                                indicesLabel="i"
                            />
                            
                            <ArrayDisplay
                                title="Count Array"
                                array={count}
                                highlightIndex={highlight.count}
                                readIndex={highlight.countRead}
                                indicesLabel="val"
                            />

                            <ArrayDisplay
                                title="Output Array"
                                array={output}
                                highlightIndex={highlight.output}
                                indicesLabel="pos"
                            />

                            {isFinalStep && (
                                <div className="mt-8 p-5 rounded-xl bg-green-900 border-green-700 text-center shadow-lg">
                                    <p className="text-green-400 text-2xl font-extrabold flex items-center justify-center gap-3">
                                        <span role="img" aria-label="confetti">🎉</span> Algorithm Complete!
                                    </p>
                                </div>
                            )}

                        </div>
                    </>
                ) : (
                    <div className="text-center p-12 bg-gray-800 rounded-xl text-gray-400 text-xl shadow-xl border border-gray-700">
                        <p className="mb-4">Welcome to the Counting Sort Visualizer!</p>
                        <p>Enter a list of non-negative <b>numbers</b> (max value 50).</p>
                        <p className="mt-2">Click <b>Re-Visualize</b> to begin.</p>
                    </div>
                )}
            </div>
        </div>
    );
}