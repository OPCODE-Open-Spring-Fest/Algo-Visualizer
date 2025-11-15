import React, { useState } from "react";
import LinearSearch from "./linearSearch";
import BinarySearch from "./BinarySearch";
import RabinKarp from "./RabinKarp";  

export default function SearchingPage() {  
  const [selectedAlgo, setSelectedAlgo] = useState("");

  const renderAlgorithm = () => {
    switch (selectedAlgo) {
      case "LinearSearch":
        return <LinearSearch />;
      case "BinarySearch":
        return <BinarySearch />;
      case "RabinKarp":  
        return <RabinKarp />; 
          
      default:
        return (
          <div className="text-gray-400 text-lg mt-20 text-center">
            Select an algorithm to visualize 👆
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="w-64 bg-[#0f172a] p-6">
        <h2 className="text-xl font-bold mb-6 text-indigo-400">
          Searching Panel
        </h2>

        <label className="block mb-2 text-sm">Algorithm:</label>
        <select
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value)}
          className="w-full p-2 rounded bg-[#1e293b] text-white border border-gray-600 cursor-pointer"
        >
          <option value="">Select Algorithm</option>
          <option value="LinearSearch">Linear Search</option>
          <option value="BinarySearch">Binary Search</option>
          <option value="RabinKarp">Rabin-Karp</option> 
        </select>

        <button
          onClick={() => setSelectedAlgo("")}
          className="w-full mt-4 py-2 bg-gray-600 hover:bg-gray-700 rounded cursor-pointer"
        >
          Reset
        </button>

        <a
          href="/"
          className="inline-block mt-10 text-indigo-400 hover:underline text-sm"
        >
          ← Back to Home
        </a>
      </div>

      <div className="flex-1 flex justify-center items-center">
        {renderAlgorithm()}
      </div>
    </div>
  );
}