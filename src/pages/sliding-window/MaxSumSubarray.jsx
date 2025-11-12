import React, { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import MaxSumSubarrayVisualizer from "../../components/sliding-window/MaxSumSubarrayVisualizer";
import { maxSumSubarray } from "../../algorithms/sliding-window/maxSumSubarray";

export default function MaxSumSubarray() {
    const [array, setArray] = useState([2, 1, 5, 1, 3, 2]);
    const [input, setInput] = useState("2,1,5,1,3,2");
    const [windowSize, setWindowSize] = useState(3);
    const [speed, setSpeed] = useState(800);
    const [isRunning, setIsRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(null);
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const intervalRef = useRef(null);
    const hasNotifiedRef = useRef(false);

    // Handle input
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);
        const numbers = value
            .split(",")
            .map((n) => parseInt(n.trim()))
            .filter((n) => !isNaN(n));
        setArray(numbers);
        resetSteps();
    };
    const handleWindowSizeChange = (e) => {
        const size = parseInt(e.target.value);
        if (!isNaN(size) && size > 0) {
            setWindowSize(size);
            resetSteps();
        }
    };
    const resetSteps = () => {
        setCurrentStep(null);
        setSteps([]);
        setCurrentStepIndex(0);
        hasNotifiedRef.current = false;
    };
    const startVisualization = async () => {
        if (isRunning || array.length === 0) {
            toast.error("Please ensure the array is valid.");
            return;
        }
        if (windowSize > array.length) {
            toast.error(`Window size cannot exceed array length (${array.length})`);
            return;
        }
        if (windowSize <= 0) {
            toast.error("Window size must be greater than 0");
            return;
        }
        setIsRunning(true);
        resetSteps();

        const gen = maxSumSubarray(array, windowSize);
        const allSteps = [];
        try {
            for (let step of gen) allSteps.push(step);
            setSteps(allSteps);
            setCurrentStep(allSteps[0]);
        }catch (error) {
            toast.error(error.message);
            setIsRunning(false);
        }
    };
    useEffect(() => {
        if (!isRunning || steps.length === 0) return;

        clearInterval(intervalRef.current);
        let index = 0;
        intervalRef.current = setInterval(() => {
            setCurrentStepIndex((prev) => {
                index = prev + 1;

                if (index >= steps.length) {
                    clearInterval(intervalRef.current);
                    setIsRunning(false);

                    if (!hasNotifiedRef.current && steps.length > 0) {
                        const finalStep = steps[steps.length - 1];
                        toast.success(
                            `✅ Maximum sum found: ${finalStep.maxSum} (Window: [${finalStep.windowStart}, ${finalStep.windowEnd}])`,
                            { duration: 3000 }
                        );
                        hasNotifiedRef.current = true;
                    }
                    return prev;
                }
                const step = steps[index];
                setCurrentStep(step);
                if (step.type === "new_max") {
                    toast.success(`  Yo! New maximum found: ${step.maxSum}`, {
                        duration: 2000,
                    });
                }
                return index;
            });
        }, speed);
        return () => clearInterval(intervalRef.current);
    }, [isRunning, steps, speed]);

    const handleReset = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setArray([2, 1, 5, 1, 3, 2]);
        setInput("2,1,5,1,3,2");
        setWindowSize(3);
        setSpeed(800);
        resetSteps();
    };

    return (
        <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center py-10 px-4 font-sans">
            <Toaster position="top-center" />
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-400 mb-8 text-center">
                Sliding Window — Max Sum Subarray
            </h1>
            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-6 bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-3xl mb-10">
                <Control
                    label="Array"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="e.g. 2,1,5,1,3,2"
                    disabled={isRunning}
                />
                <Control label="Window Size"  type="number"  value={windowSize}
                    onChange={handleWindowSizeChange}
                    disabled={isRunning} />
                <div className="flex flex-col items-center">
                    <label className="text-sm text-gray-400 mb-1">
                        Speed ({speed}ms)
                    </label>
                    <input type="range" min="200" max="2000" step="100" value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        disabled={isRunning}
                        className="w-40 accent-indigo-500" />
                </div>
                <div className="flex items-end gap-2">
                    <button
                        onClick={startVisualization}
                        disabled={isRunning || array.length === 0}
                        className={`px-5 py-2 rounded-md text-sm font-semibold transition ${
                            isRunning
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-500"
                        }`}
                    >
                        {isRunning ? "Running..." : "Start"}
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={isRunning}
                        className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-semibold transition"
                    >
                        Reset
                    </button>
                </div>
            </div>
            <div className="w-full max-w-4xl">
                <MaxSumSubarrayVisualizer
                    array={array}
                    windowStart={currentStep?.windowStart ?? -1}
                    windowEnd={currentStep?.windowEnd ?? -1}
                    currentSum={currentStep?.currentSum ?? 0}
                    maxSum={currentStep?.maxSum ?? 0}
                    type={currentStep?.type ?? "default"}
                    removedIndex={currentStep?.removedIndex}
                    addedIndex={currentStep?.addedIndex}
                />
            </div>
            {currentStep && (
                <div className="mt-10 bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 w-full max-w-3xl text-center">
                    <p className="text-indigo-400 font-semibold mb-1">
                        Step {currentStepIndex + 1} / {steps.length}
                    </p>
                    {currentStep.message && (
                        <p className="text-gray-200 text-sm">{currentStep.message}</p>
                    )}
                    <div className="mt-3 flex justify-center gap-8 text-sm text-gray-300">
                        <span>
                            <span className="text-gray-400">Window:</span>{" "}
                            <span className="text-indigo-400 font-semibold">
                                [{currentStep.windowStart}, {currentStep.windowEnd}]
                            </span>
                        </span>
                        <span>
                            <span className="text-gray-400">Current Sum:</span>{" "}
                            <span className="text-yellow-400 font-semibold">
                                {currentStep.currentSum}
                            </span>
                        </span>
                        <span>
                            <span className="text-gray-400">Max Sum:</span>{" "}
                            <span className="text-purple-400 font-semibold">
                                {currentStep.maxSum}
                            </span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
function Control({ label, type = "text", value, onChange, placeholder, disabled }) {
    return (
        <div className="flex flex-col items-center">
            <label className="text-sm text-gray-400 mb-1">{label}</label>
            <input type={type} value={value} onChange={onChange} placeholder={placeholder}
                disabled={disabled}
                className="p-2 rounded-md bg-gray-800 border border-gray-700 text-center w-40 text-sm text-white disabled:opacity-50"
            />
        </div>
    );
}
