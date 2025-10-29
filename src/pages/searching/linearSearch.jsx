import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast"; 
import LinearSearchVisualizer from "../../components/searching/LinearSearchVisualizer";
import { linearSearch } from "../../algorithms/searching/LinearSearch";

function ArrayValues({ array }) {
    return (
        <div className="flex justify-center space-x-2 mt-2"> 
            {array.map((value, idx) => (
                <div key={idx} className="w-6 text-sm font-bold text-center font-mono">
                    {value}
                </div>
            ))}
        </div>
    );
}
export default function LinearSearch() {
    const [array, setArray] = useState([]);
    const [input, setInput] = useState("");
    
    // --- SEARCH STATES ---
    const [target, setTarget] = useState(""); 
    const [highlightIndex, setHighlightIndex] = useState(null); 
    const [foundIndex, setFoundIndex] = useState(null); 
    // ---------------------
    
    const [isRunning, setIsRunning] = useState(false);

    const handleStart = async () => {
        if (isRunning || array.length === 0 || isNaN(parseInt(target))) {
            toast.error("Please ensure the array and target are valid.");
            return;
        }

        setIsRunning(true);
        setHighlightIndex(null); 
        setFoundIndex(null); 

        const targetNumber = parseInt(target);
        
        // Pass the array AND the target to the generator
        const gen = linearSearch(array, targetNumber); 

        for (let step of gen) {
            // Update search-specific states
            setHighlightIndex(step.highlightIndex); 
            setFoundIndex(step.foundIndex);
            
            if (step.message) {
                if (step.foundIndex !== null) {
                    toast.success(step.message);
                } else {
                    toast.error(step.message);
                }
            }

            // Wait for 500ms for visualization (adjust this speed later)
            await new Promise((r) => setTimeout(r, 500)); 
        }

        setIsRunning(false);
    };

    const handleReset = () => {
        setArray([]);
        setInput("");
        setTarget(""); // Reset target input
        setHighlightIndex(null); 
        setFoundIndex(null); 
        setIsRunning(false);
    };

    const handleInput = (e) => {
        setInput(e.target.value);
        const numbers = e.target.value
            .split(",")
            .map((n) => parseInt(n.trim()))
            .filter((n) => !isNaN(n));
        setArray(numbers);
    };

    const handleTargetChange = (e) => {
        setTarget(e.target.value);
    };

    return (
        <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center p-6">
            <Toaster position="top-center" />
            <h1 className="text-4xl font-extrabold mb-8 text-indigo-400 drop-shadow-lg">
                Linear Search Visualizer
            </h1>

            {/* INPUTS: ARRAY AND TARGET */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                <input
                    type="text"
                    value={input}
                    onChange={handleInput}
                    placeholder="Enter array (e.g., 10,20,50,40)"
                    className="border-2 border-gray-400 bg-gray-900 text-green-200 rounded-lg p-3 w-80 text-center shadow-lg focus:ring-2 focus:ring-blue-500  outline-none"
                />
                <input
                    type="number"
                    value={target}
                    onChange={handleTargetChange}
                    placeholder="Target Value"
                    className="border-2 border-gray-300 bg-gray-900 text-yellow-200 rounded-lg p-3 w-40 text-center shadow-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div className="space-x-4 mt-6">
                <button
                    onClick={handleStart}
                    disabled={isRunning || array.length === 0}
                    className={`${
                        isRunning || array.length === 0
                            ? "bg-indigo-500 text-white cursor-not-allowed"
                            : "bg-indigo-500 hover:bg-indigo-900 cursor-pointer"
                    } px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-300 `}
                >
                    {isRunning ? "Searching..." : "Start Linear Search"}
                </button>
                <button
                    onClick={handleReset}
                    className="bg-gray-700 cursor-pointer hover:bg-gray-600 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-300"
                >
                    Reset
                </button>
            </div>

            <div className="mt-15">
                {/* USE THE NEW VISUALIZER AND PASS SEARCH STATES */}
                <LinearSearchVisualizer 
                    array={array} 
                    highlightIndex={highlightIndex} 
                    foundIndex={foundIndex}
                />
                <ArrayValues array={array} />
            </div>

        </div>
    );
}