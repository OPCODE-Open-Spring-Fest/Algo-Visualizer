import React, { useState, useMemo, useEffect, useRef } from "react";
import { rodCuttingTopDown, rodCuttingBottomUp } from "@/algorithms/dynamic-programming/rodCutting";

const PricesArray = ({ prices, currentIndex }) => {
    return (
        <div className="mt-4">
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">Prices Array (P[i])</h3>
            <div className="flex flex-wrap gap-2 justify-center">
                {prices.map((value, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg text-center transition-all duration-300 ease-in-out border-2 w-20 flex flex-col justify-center items-center ${index === currentIndex
                                ? "bg-yellow-600 border-yellow-400 shadow-lg text-white font-bold transform scale-105" 
                                : "bg-gray-700 border-gray-600 text-gray-200 hover:border-gray-500"
                            }`}
                        title={`P(${index}) - Price for length ${index + 1}`}
                    >
                        <div className="text-sm font-light text-gray-400">P({index})</div>
                        <div className="text-xl mt-1">{value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DPArray = ({ array, currentIndex, readingIndices = [], algorithm }) => {
    const isMemoization = algorithm === "topDown";
    const label = isMemoization ? "Memo Table (Profit[i])" : "DP Array (Profit[i])";

    return (
        <div className="mt-4">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">{label}</h3>
            <div className="flex flex-wrap gap-2 justify-center">
                {array.map((value, index) => {
                    const isCurrent = index === currentIndex; 
                    const isReading = readingIndices.includes(index); 

                    let cellClass = "bg-gray-700 border-gray-600 text-gray-200 hover:border-gray-500";
                    if (isCurrent) {
                        cellClass = "bg-blue-600 border-blue-400 shadow-lg text-white font-bold transform scale-105";
                    } else if (isReading) {
                        cellClass = "bg-yellow-600 border-yellow-400 text-white"; 
                    }

                    return (
                        <div
                            key={index}
                            className={`p-3 rounded-lg text-center transition-all duration-300 ease-in-out border-2 w-20 flex flex-col justify-center items-center ${cellClass}`}
                            title={`Profit(${index})`}
                        >
                            <div className="text-sm font-light text-gray-400">Profit({index})</div>
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

export default function RodCuttingVisualizer() {
    const [priceInput, setPriceInput] = useState("1, 5, 8, 9, 10, 17, 17, 20");
    const [prices, setPrices] = useState([1, 5, 8, 9, 10, 17, 17, 20]);
    const [algorithm, setAlgorithm] = useState("bottomUp");

    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(SPEED_OPTIONS["Medium"]);
    const timerRef = useRef(null);

    const handleCompute = () => {
        const parsedPrices = priceInput
            .split(',')
            .map(s => Number(s.trim()))
            .filter(n => !isNaN(n) && n >= 0);

        if (parsedPrices.length === 0 || parsedPrices.length > 15) {
            alert("Please enter a valid, comma-separated list of 1 to 15 prices.");
            return;
        }

        setPrices(parsedPrices); 
        setIsPlaying(false); 

        const { steps: newSteps } =
            algorithm === "topDown"
                ? rodCuttingTopDown(parsedPrices)
                : rodCuttingBottomUp(parsedPrices);

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
    const n = prices.length;
    const isFinalStep = steps.length > 0 && currentStep === steps.length - 1;
    const finalResult = isFinalStep && currentState.array ? currentState.array[n] : null;


    return (
        <div className="p-6 min-h-screen bg-gray-900 text-gray-100 font-sans">
            <div className="max-w-6xl mx-auto"> 
                <h1 className="text-4xl font-extrabold mb-8 text-indigo-400 text-center drop-shadow-lg">
                    Rod Cutting Algorithm
                </h1>

                <details className="mb-8 p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-inner group">
                    <summary className="cursor-pointer text-xl font-bold text-teal-400 hover:text-teal-300 transition-colors">
                        ❓ What is the Rod Cutting Problem?
                    </summary>
                    <div className="mt-3 p-3 border-t border-gray-700 text-gray-300">
                        <p className="mb-2">
                            Given a rod of length <strong>n</strong> and an array of <strong>prices</strong> for rods of length 1 to n,
                            determine the maximum value obtainable by cutting up the rod and selling the pieces.
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>
                                <b>Top-Down (Memoization):</b> A recursive approach. To solve for length `k`, it tries all cuts `j` and recursively finds the best profit for the remaining piece (`k-j`), storing results to avoid re-computation.
                            </li>
                            <li>
                                <b>Bottom-Up (Tabulation):</b> An iterative approach. It fills a DP table from length 0 up to `n`. To find the profit for length `i`, it looks at the *already computed* profits for smaller lengths.
                            </li>
                        </ul>
                    </div>
                </details>

                <div className="flex flex-col xl:flex-row justify-center items-center gap-5 mb-8 p-6 rounded-xl bg-gray-800 shadow-2xl border border-gray-700">
                    <div className="flex-1 w-full xl:w-auto">
                        <label htmlFor="price-input" className="text-gray-300 text-lg mb-2 block">Prices (comma-separated):</label>
                        <input
                            id="price-input"
                            type="text"
                            className="border border-gray-600 p-2 rounded-lg w-full bg-gray-700 text-white text-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            value={priceInput}
                            onChange={(e) => setPriceInput(e.target.value)}
                            placeholder="e.g., 1, 5, 8, 9"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <label htmlFor="algorithm-select" className="text-gray-300 text-lg">Algorithm:</label>
                        <select
                            id="algorithm-select"
                            className="border border-gray-600 p-2 rounded-lg bg-gray-700 text-white text-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            value={algorithm}
                            onChange={(e) => setAlgorithm(e.target.value)}
                        >
                            <option value="bottomUp">Bottom-Up (Tabulation)</option>
                            <option value="topDown">Top-Down (Memoization)</option>
                        </select>
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
                                    className={`px-3 py-2 rounded-lg font-semibold transition duration-150 ${currentStep < steps.length - 1 ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
                                    onClick={handleNext}
                                    disabled={currentStep === steps.length - 1}
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
                            </p>
                        </div>

                        <div className="border border-gray-700 p-6 rounded-xl bg-gray-800 shadow-2xl">
                            <div className="mb-6 p-4 rounded-lg bg-gray-700 border-l-4 border-teal-400 shadow-inner min-h-[100px]">
                                <p className="text-teal-400 font-medium text-md uppercase tracking-wide">Current Action</p>
                                <p className="text-xl mt-2 text-gray-200 leading-relaxed">
                                    {currentState.message || 'Starting computation...'}
                                </p>
                            </div>

                            <PricesArray
                                prices={prices}
                                currentIndex={currentState.priceIndex}
                            />

                            {currentState.array && (
                                <DPArray
                                    array={currentState.array}
                                    currentIndex={currentState.currentIndex}
                                    readingIndices={currentState.readingIndices}
                                    algorithm={algorithm}
                                />
                            )}

                            {isFinalStep && finalResult !== null && (
                                <div className="mt-8 p-5 rounded-xl bg-green-900 border border-green-700 text-center shadow-lg">
                                    <p className="text-green-400 text-2xl font-extrabold flex items-center justify-center gap-3">
                                        <span role="img" aria-label="confetti">🎉</span> Final Result: Max Profit for length {n} = <span className="text-green-200 text-3xl">{finalResult}</span>
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
                        <p className="mb-4">Welcome to the Rod Cutting DP Visualizer!</p>
                        <p>Enter a list of <b>Prices</b> and select an <b>Algorithm</b> above.</p>
                        <p className="mt-2">Click <b>Re-Visualize</b> to begin.</p>
                    </div>
                )}
            </div>
        </div>
    );
}