import React, { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { ArrowLeft, Play, Pause, StepForward, RotateCcw } from "lucide-react";
import FractionalKnapsackVisualizer from "../../components/greedy/FractionalKnapsackVisualizer";
import { fractionalKnapsack } from "../../algorithms/greedy/fractionalKnapsack";

export default function FractionalKnapsackPage() {
  const [weights, setWeights] = useState([10, 20, 30]);
  const [values, setValues] = useState([60, 100, 120]);
  const [capacity, setCapacity] = useState(50);
  const [weightsInput, setWeightsInput] = useState("10,20,30");
  const [valuesInput, setValuesInput] = useState("60,100,120");
  const [capacityInput, setCapacityInput] = useState("50");
  const [speed, setSpeed] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const timerRef = useRef(null);

  useEffect(() => {
    if (weights.length === 0 || values.length === 0 || capacity <= 0) {
      setSteps([]);
      setStepIndex(-1);
      setCurrentStep(null);
      return;
    }
    if (weights.length !== values.length) {
      toast.error("Weights and Values arrays must have the same length!");
      return;
    }
    setIsPlaying(false);
    clearTimeout(timerRef.current);
    const generator = fractionalKnapsack(weights, values, capacity);
    setSteps(Array.from(generator));
    setStepIndex(0);
    setCurrentStep(steps[0] || null);
  }, [weights, values, capacity]);

  useEffect(() => {
    if (isPlaying && stepIndex < steps.length - 1) {
      timerRef.current = setTimeout(() => {
        setStepIndex((prev) =>
          prev + 1 < steps.length ? prev + 1 : steps.length - 1
        );
      }, speed);
    } else if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, stepIndex, steps.length, speed]);

  useEffect(() => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(steps[stepIndex]);
    }
  }, [stepIndex, steps]);

  const handleWeightsChange = (e) => {
    const value = e.target.value;
    setWeightsInput(value);
    try {
      const parsed = value
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p !== "")
        .map((p) => Number(p))
        .filter((p) => !isNaN(p) && p > 0);
      if (parsed.length > 0) {
        setWeights(parsed);
      }
    } catch (err) {
      console.error("Error parsing weights:", err);
    }
  };
  const handleValuesChange = (e) => {
    const value = e.target.value;
    setValuesInput(value);
    try {
      const parsed = value
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p !== "")
        .map((p) => Number(p))
        .filter((p) => !isNaN(p) && p > 0);
      if (parsed.length > 0) {
        setValues(parsed);
      }
    } catch (err) {
      console.error("Error parsing values:", err);
    }
  };

  const handleCapacityChange = (e) => {
    const value = e.target.value;
    setCapacityInput(value);
    const parsed = Number(value);
    if (!isNaN(parsed) && parsed > 0) {
      setCapacity(parsed);
    }
  };
  const loadDemo = () => {
    setWeights([10, 20, 30]);
    setValues([60, 100, 120]);
    setCapacity(50);
    setWeightsInput("10,20,30");
    setValuesInput("60,100,120");
    setCapacityInput("50");
  };
  const togglePlay = () => {
    if (steps.length === 0) return;
    if (stepIndex >= steps.length - 1) {
      setStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };
  const reset = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
    setSteps([]);
    setStepIndex(-1);
    setCurrentStep(null);
  };

  return (
    <div className="w-full h-full bg-gray-800 text-white flex flex-col">
      <Toaster position="top-center" />
      <div className="p-4 border-b border-gray-700 bg-gray-900 flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-indigo-400 hover:text-indigo-300 text-sm font-semibold"
          >
            <ArrowLeft size={16} className="mr-1" /> Back
          </button>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Weights:</label>
            <input
              value={weightsInput}
              onChange={handleWeightsChange}
              className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm w-32 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="10,20,30"/>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Values:</label>
            <input
              value={valuesInput}
              onChange={handleValuesChange}
              className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm w-32 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="60,100,120"/>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Capacity:</label>
            <input
              type="number"
              value={capacityInput}
              onChange={handleCapacityChange}
              className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm w-20 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="50"/>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400">Speed:</label>
          <input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="accent-blue-500 w-24"
          />
          <span className="text-xs text-gray-500">{speed}ms</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={reset}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="p-4 flex justify-between items-center border-b border-gray-700 bg-gray-900">
        <div>
          <h1 className="text-xl font-bold">
            Fractional Knapsack Problem
          </h1>
        </div>
        {currentStep && (
          <div className="text-right">
            <div className="text-xs text-gray-400 mb-1">
              Step {stepIndex + 1} / {steps.length}
            </div>
            <div className="text-sm text-white font-semibold">
              {currentStep.type?.replace(/_/g, " ").toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {currentStep && currentStep.message && (
        <div className="p-3 items-center text-center">
          <div className="text-xs text-white font-medium">
            {currentStep.message}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-4 bg-gray-950">
        {currentStep ? (
          <FractionalKnapsackVisualizer items={currentStep.items || []} currentStep={currentStep} capacity={capacity}/>
        ) : (
          <div className="text-gray-400 text-center mt-20">Enter weights, values, and capacity to start</div>
        )}
      </div>
    </div>
  );
}

