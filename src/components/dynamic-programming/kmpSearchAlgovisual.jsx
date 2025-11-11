import React, { useState, useMemo, useEffect, useRef } from "react";
import { computeLPSSteps, kmpSearchSteps } from "@/algorithms/dynamic-programming/kmpAlgo";

const LPSDisplay = ({ pattern, lpsState }) => {
  const { lps, highlight, message } = lpsState;
  const { i, len, state } = highlight;

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-3 text-blue-400">Phase 1: Building LPS Table</h3>
      <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 font-mono text-lg">
        <div className="flex flex-wrap gap-1 justify-center">
          <div className="w-12 text-right pr-2 text-gray-500">Pattern:</div>
          {pattern.split("").map((char, index) => (
            <div
              key={index}
              className={`w-10 h-10 flex items-center justify-center rounded border
                ${index === i ? "border-red-500 border-2" : "border-gray-600"}
                ${index === len ? "bg-blue-800" : "bg-gray-700"}
              `}
              title={`pattern[${index}]`}
            >
              {char}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 justify-center mt-2 text-sm">
            <div className="w-12"></div>
            {pattern.split("").map((_, index) => (
                <div key={index} className="w-10 h-auto text-center relative">
                    {index === i && <span className="text-red-500 font-bold">i</span>}
                    {index === len && <span className="text-blue-400 font-bold ml-2">len</span>}
                </div>
            ))}
        </div>

        <div className="flex flex-wrap gap-1 justify-center mt-4">
          <div className="w-12 text-right pr-2 text-gray-500">LPS:</div>
          {lps.map((value, index) => (
            <div
              key={index}
              className={`w-10 h-10 flex items-center justify-center rounded border
                ${highlight.lps === index ? "bg-green-700 border-green-500" : "border-gray-600 bg-gray-700"}
                ${state === 'match' && highlight.lps === index && 'animate-pulse'}
              `}
              title={`lps[${index}]`}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 p-3 bg-gray-700 rounded-lg border-l-4 border-blue-400">
        <p className="text-blue-300 font-medium">Current Action</p>
        <p className="text-gray-200 mt-1">{message}</p>
      </div>
    </div>
  );
};

const SearchDisplay = ({ text, pattern, searchState }) => {
  const { i, j, matches, highlight, message } = searchState;
  const { state, matchIndex } = highlight;
  const m = pattern.length;
  const patternOffset = i - j;

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-3 text-green-400">Phase 2: Searching Text</h3>
      <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 font-mono text-lg overflow-x-auto">
        <div className="flex flex-wrap gap-1">
          <div className="w-12 text-right pr-2 text-gray-500">Text:</div>
          {text.split("").map((char, index) => (
            <div
              key={index}
              className={`w-10 h-10 flex items-center justify-center rounded border
                ${index === i ? "border-red-500 border-2" : "border-gray-600"}
                ${matches.includes(index - m + 1) ? 'bg-green-900' : 'bg-gray-700'}
                ${matchIndex === index - m + 1 ? 'animate-pulse bg-green-700 border-green-500' : ''}
              `}
              title={`text[${index}]`}
            >
              {char}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 mt-2 text-sm">
            <div className="w-12"></div>
            {text.split("").map((_, index) => (
                <div key={index} className="w-10 h-auto text-center relative">
                    {index === i && <span className="text-red-500 font-bold">i</span>}
                </div>
            ))}
        </div>

        <div className="flex flex-wrap gap-1 mt-4" style={{ marginLeft: `${patternOffset * 3}rem` }}>
          <div className="w-12 text-right pr-2 text-gray-500">Pattern:</div>
          {pattern.split("").map((char, index) => (
            <div
              key={index}
              className={`w-10 h-10 flex items-center justify-center rounded border
                ${index === j ? "border-blue-500 border-2" : "border-gray-600"}
                ${state === 'compare' && index === j && pattern[j] === text[i] ? 'bg-green-800' : ''}
                ${state === 'compare' && index === j && pattern[j] !== text[i] ? 'bg-red-800' : ''}
                ${state === 'jump' ? 'bg-yellow-800' : 'bg-gray-700'}
              `}
              title={`pattern[${index}]`}
            >
              {char}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 mt-2 text-sm" style={{ marginLeft: `${patternOffset * 3}rem` }}>
            <div className="w-12"></div>
            {pattern.split("").map((_, index) => (
                <div key={index} className="w-10 h-auto text-center relative">
                    {index === j && <span className="text-blue-400 font-bold">j</span>}
                </div>
            ))}
        </div>
      </div>
      <div className="mt-4 p-3 bg-gray-700 rounded-lg border-l-4 border-green-400">
        <p className="text-green-300 font-medium">Current Action</p>
        <p className="text-gray-200 mt-1">{message}</p>
      </div>
    </div>
  );
};

const SPEED_OPTIONS = {
  "Slow": 1500,
  "Medium": 500,
  "Fast": 200,
};

export default function KMPVisualizer() {
  const [text, setText] = useState("ABABDABACDABABCABAB");
  const [pattern, setPattern] = useState("ABABCABAB");
  
  const [lpsSteps, setLpsSteps] = useState([]);
  const [searchSteps, setSearchSteps] = useState([]);
  const [lpsTable, setLpsTable] = useState([]);
  const [matches, setMatches] = useState([]);

  const [currentStep, setCurrentStep] = useState(0);
  const [visualizationPhase, setVisualizationPhase] = useState("idle");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(SPEED_OPTIONS["Medium"]);
  const timerRef = useRef(null);

  const handleCompute = () => {
    setIsPlaying(false);
    clearInterval(timerRef.current);

    if (!pattern) {
      alert("Please enter a pattern.");
      return;
    }

    const { steps: newLpsSteps, lpsTable: newLpsTable } = computeLPSSteps(pattern);
    const { steps: newSearchSteps, matches: newMatches } = kmpSearchSteps(text, pattern, newLpsTable);

    setLpsSteps(newLpsSteps);
    setLpsTable(newLpsTable);
    setSearchSteps(newSearchSteps);
    setMatches(newMatches);

    setCurrentStep(0);
    setVisualizationPhase("lps");
  };

  useEffect(() => {
    handleCompute();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        handleNext(true);
      }, speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, speed, currentStep, visualizationPhase]);

  const togglePlay = () => {
    if (visualizationPhase === 'done') {
        setCurrentStep(0);
        setVisualizationPhase('lps');
        setIsPlaying(true);
    } else {
        setIsPlaying(!isPlaying);
    }
  };

  const handleNext = (isAutoPlay = false) => {
    if (!isAutoPlay) setIsPlaying(false);

    if (visualizationPhase === 'lps') {
      if (currentStep < lpsSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep(0);
        setVisualizationPhase('search');
      }
    } else if (visualizationPhase === 'search') {
      if (currentStep < searchSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setVisualizationPhase('done');
        setIsPlaying(false);
      }
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);

    if (visualizationPhase === 'search') {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      } else {
        setCurrentStep(lpsSteps.length - 1);
        setVisualizationPhase('lps');
      }
    } else if (visualizationPhase === 'lps') {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    }
  };
  
  const handleTextChange = (e) => {
      setText(e.target.value);
      setVisualizationPhase('idle');
  }
  
  const handlePatternChange = (e) => {
      setPattern(e.target.value);
      setVisualizationPhase('idle');
  }

  const currentLpsState = useMemo(() => lpsSteps[currentStep] || {}, [lpsSteps, currentStep]);
  const currentSearchState = useMemo(() => searchSteps[currentStep] || {}, [searchSteps, currentStep]);

  const isFinalStep = visualizationPhase === 'done';

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-indigo-400 text-center drop-shadow-lg">
          KMP String Search
        </h1>

        <details className="mb-8 p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-inner group">
          <summary className="cursor-pointer text-xl font-bold text-teal-400 hover:text-teal-300 transition-colors">
            ❓ What is KMP Search Algorithm?
          </summary>
          <div className="mt-3 p-3 border-t border-gray-700 text-gray-300">
            <p className="mb-2">
              The <strong>Knuth-Morris-Pratt (KMP)</strong> algorithm is an efficient string searching algorithm that finds all occurrences of a pattern in a text string.
              It avoids unnecessary character comparisons by using information from previous matches.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                <b>Phase 1 - LPS Table (Longest Proper Prefix which is also Suffix):</b> Preprocesses the pattern to build an LPS array that stores the length of the longest proper prefix that is also a suffix for each position in the pattern. This helps determine how far we can skip characters when a mismatch occurs.
              </li>
              <li>
                <b>Phase 2 - Pattern Searching:</b> Uses the LPS table to search for the pattern in the text. When a mismatch occurs, instead of starting from the beginning of the pattern, it uses the LPS values to skip unnecessary comparisons, making the search linear time O(n + m) instead of O(n*m).
              </li>
            </ul>
          </div>
        </details>

        <div className="flex flex-wrap justify-center items-center gap-5 mb-8 p-6 rounded-xl bg-gray-800 shadow-2xl border border-gray-700">
          <div className="flex items-center gap-3">
            <label htmlFor="text-input" className="text-gray-300 text-lg">Text:</label>
            <input
              id="text-input"
              type="text"
              className="border border-gray-600 p-2 rounded-lg w-64 bg-gray-700 text-white text-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono"
              value={text}
              onChange={handleTextChange}
            />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="pattern-input" className="text-gray-300 text-lg">Pattern:</label>
            <input
              id="pattern-input"
              type="text"
              className="border border-gray-600 p-2 rounded-lg w-48 bg-gray-700 text-white text-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono"
              value={pattern}
              onChange={handlePatternChange}
            />
          </div>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition duration-300 ease-in-out shadow-md transform hover:-translate-y-0.5"
            onClick={handleCompute}
          >
            Re-Visualize
          </button>
        </div>

        {visualizationPhase !== 'idle' ? (
          <>
            <div className="flex flex-wrap justify-between items-center mb-6 p-4 rounded-xl bg-gray-800 border border-gray-700 shadow-lg">
                <button
                    className={`px-5 py-2 rounded-lg font-semibold text-lg transition duration-200 ease-in-out transform hover:scale-105 ${isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white shadow-md`}
                    onClick={togglePlay}
                    disabled={isFinalStep && isPlaying}
                >
                    {isFinalStep ? "Replay ▶️" : isPlaying ? "Pause ⏸️" : "Play ▶️"}
                </button>

                <div className="flex gap-2">
                    <button
                        className={`px-3 py-2 rounded-lg font-semibold transition duration-150 ${(currentStep > 0 || visualizationPhase === 'search') ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
                        onClick={handlePrev}
                        disabled={currentStep === 0 && visualizationPhase === 'lps'}
                    >
                        &lt; Prev
                    </button>
                    <button
                        className={`px-3 py-2 rounded-lg font-semibold transition duration-150 ${!isFinalStep ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
                        onClick={() => handleNext(false)}
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
                 {visualizationPhase === 'lps' && `Phase 1 (LPS): Step ${currentStep + 1} / ${lpsSteps.length}`}
                 {visualizationPhase === 'search' && `Phase 2 (Search): Step ${currentStep + 1} / ${searchSteps.length}`}
                 {visualizationPhase === 'done' && `Visualization Complete!`}
               </p>
            </div>

            <div className="border border-gray-700 p-6 rounded-xl bg-gray-800 shadow-2xl">
                {visualizationPhase === 'lps' && (
                    <LPSDisplay
                        pattern={pattern}
                        lpsState={currentLpsState}
                    />
                )}
                {(visualizationPhase === 'search' || visualizationPhase === 'done') && (
                    <SearchDisplay
                        text={text}
                        pattern={pattern}
                        searchState={currentSearchState}
                    />
                )}
                
                {isFinalStep && (
                    <div className="mt-8 p-5 rounded-xl bg-green-900 border border-green-700 text-center shadow-lg">
                        <p className="text-green-400 text-2xl font-extrabold flex items-center justify-center gap-3">
                            <span role="img" aria-label="confetti">🎉</span>
                            Search Finished: {matches.length} match(es) found at indices: {matches.join(', ')}
                        </p>
                    </div>
                )}
            </div>
          </>
        ) : (
          <div className="text-center p-12 bg-gray-800 rounded-xl text-gray-400 text-xl shadow-xl border border-gray-700">
            <p>Enter text and a pattern, then click "Re-Visualize" to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}