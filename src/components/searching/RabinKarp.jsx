import React, { useState, useMemo, useEffect, useRef } from "react";
// Assumes 'algorithms' is at 'src/algorithms/'
import { getRabinKarpSteps } from "../../algorithms/searching/RabinKarp";

const StringDisplay = ({ text, highlights = {} }) => {
    return (
        <div className="flex flex-wrap gap-1 font-mono text-lg justify-center">
            {text.split("").map((char, index) => {
                let
                    bgColor = "bg-gray-700",
                    textColor = "text-gray-200",
                    borderColor = "border-gray-600";

                if (highlights[index]) {
                    const type = highlights[index];
                    if (type === "match") {
                        bgColor = "bg-green-600";
                        textColor = "text-white";
                        borderColor = "border-green-400";
                    } else if (type === "spurious") {
                        bgColor = "bg-yellow-600";
                        textColor = "text-white";
                        borderColor = "border-yellow-400";
                    } else if (type === "compare") {
                        bgColor = "bg-blue-600";
                        textColor = "text-white";
                        borderColor = "border-blue-400";
                    }
                }

                return (
                    <div
                        key={index}
                        className={`w-10 h-10 flex items-center justify-center rounded border-2 transition-all duration-200 ${bgColor} ${textColor} ${borderColor}`}
                        title={`char: ${char} (index: ${index})`}
                    >
                        {char}
                    </div>
                );
            })}
        </div>
    );
};

const PatternDisplay = ({ pattern, highlights = {} }) => {
    return (
        <div className="flex flex-wrap gap-1 font-mono text-lg justify-center">
            {pattern.split("").map((char, index) => {
                let
                    bgColor = "bg-gray-700",
                    textColor = "text-gray-200",
                    borderColor = "border-gray-600";

                if (highlights[index]) {
                    const type = highlights[index];
                    if (type === "match") {
                        bgColor = "bg-green-600";
                        textColor = "text-white";
                        borderColor = "border-green-400";
                    } else if (type === "mismatch") {
                        bgColor = "bg-red-600";
                        textColor = "text-white";
                        borderColor = "border-red-400";
                    }
                }

                return (
                    <div
                        key={index}
                        className={`w-10 h-10 flex items-center justify-center rounded border-2 transition-all duration-200 ${bgColor} ${textColor} ${borderColor}`}
                    >
                        {char}
                    </div>
                );
            })}
        </div>
    );
};


// Playback speeds in milliseconds
const SPEED_OPTIONS = {
    "Slow": 1500,
    "Medium": 500,
    "Fast": 200,
};

export default function RabinKarp() {
    const [text, setText] = useState("AABAACAADAABAABA");
    const [pattern, setPattern] = useState("AABA");
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(SPEED_OPTIONS["Medium"]);
    const timerRef = useRef(null);

    // --- Core Logic ---

    const handleCompute = () => {
        if (!text || !pattern) {
            alert("Text and Pattern cannot be empty.");
            return;
        }
        if (pattern.length > text.length) {
            alert("Pattern cannot be longer than the text.");
            return;
        }

        setIsPlaying(false);
        const { steps: newSteps } = getRabinKarpSteps(text, pattern);
        setSteps(newSteps);
        setCurrentStep(0);
    };

    useEffect(() => {
        handleCompute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // --- Handlers ---

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
    const { status, textHighlights, patternHighlights, textHash, patternHash, message } = currentState;

    const isFinalStep = steps.length > 0 && currentStep === steps.length - 1;

    return (
        <div className="p-6 min-h-screen bg-gray-900 text-gray-100 font-sans">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-8 text-indigo-400 text-center drop-shadow-lg">
                    Rabin-Karp String Search
                </h1>

                {/* --- What is Rabin-Karp? --- */}
                <details className="mb-8 p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-inner group">
                    <summary className="cursor-pointer text-xl font-bold text-teal-400 hover:text-teal-300 transition-colors">
                        ❓ What is Rabin-Karp?
                    </summary>
                    <div className="mt-3 p-3 border-t border-gray-700 text-gray-300">
                        <p className="mb-2">
                            Rabin-Karp is a string matching algorithm that uses a **hashing function** to find a pattern in text.
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>It calculates a hash for the pattern and for each "window" of the text.</li>
                            <li>It uses a **"rolling hash"** to quickly calculate the next window's hash from the previous one.</li>
                            <li>If hashes match, it performs a character-by-character check to avoid **"spurious hits"** (where different strings have the same hash).</li>
                        </ul>
                    </div>
                </details>
                {/* --- End of What is Rabin-Karp? --- */}


                <div className="flex flex-col xl:flex-row justify-center items-center gap-5 mb-8 p-6 rounded-xl bg-gray-800 shadow-2xl border border-gray-700">
                    <div className="flex-1 w-full xl:w-auto">
                        <label htmlFor="text-input" className="text-gray-300 text-lg mb-2 block">Text:</label>
                        <input
                            id="text-input"
                            type="text"
                            className="border border-gray-600 p-2 rounded-lg w-full bg-gray-700 text-white text-lg font-mono focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 w-full xl:w-auto">
                        <label htmlFor="pattern-input" className="text-gray-300 text-lg mb-2 block">Pattern:</label>
                        <input
                            id="pattern-input"
                            type="text"
                            className="border border-gray-600 p-2 rounded-lg w-full bg-gray-700 text-white text-lg font-mono focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                        />
                    </div>

                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition duration-300 ease-in-out shadow-md transform hover:-translate-y-0.5"
                        onClick={handleCompute}
                    >
                        Visualize
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
                            <div className="mb-6 p-4 rounded-lg bg-gray-700 border-l-4 border-teal-400 shadow-inner">
                                <p className="text-teal-400 font-medium text-md uppercase tracking-wide">Current Action</p>
                                <p className="text-xl mt-2 text-gray-200 leading-relaxed">
                                    {message || 'Starting...'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold mb-3 text-blue-400">Window Hash</h3>
                                    <p className={`font-mono text-3xl p-3 rounded ${textHash === patternHash ? 'text-green-400 bg-green-900' : 'text-yellow-400 bg-yellow-900'}`}>
                                        {textHash}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold mb-3 text-blue-400">Pattern Hash</h3>
                                    <p className="font-mono text-3xl p-3 rounded text-green-400 bg-green-900">
                                        {patternHash}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-xl font-semibold mb-3 text-blue-400 text-center">Text</h3>
                                <StringDisplay text={text} highlights={textHighlights} />
                            </div>

                            <div className="mb-4">
                                <h3 className="text-xl font-semibold mb-3 text-blue-400 text-center">Pattern</h3>
                                <PatternDisplay pattern={pattern} highlights={patternHighlights} />
                            </div>

                            {isFinalStep && (
                                <div className={`mt-8 p-5 rounded-xl ${status === 'finished_found' ? 'bg-green-900 border-green-700' : 'bg-red-900 border-red-700'} text-center shadow-lg`}>
                                    <p className={`${status === 'finished_found' ? 'text-green-400' : 'text-red-400'} text-2xl font-extrabold`}>
                                        {status === 'finished_found' ? '🎉 Pattern Found! 🎉' : 'Search Complete. Pattern Not Found.'}
                                    </p>
                                </div>
                            )}

                        </div>
                    </>
                ) : (
                    <div className="text-center p-12 bg-gray-800 rounded-xl text-gray-400 text-xl shadow-xl border border-gray-700">
                        <p>Enter text and a pattern, then click "Visualize" to begin.</p>
                    </div>
                )}
            </div>
        </div>
    );
}