import React, { useState } from "react";
import { Network, Compass, Rocket } from "lucide-react";
import StackPage from "./stack.jsx";
import LinkedListPage from "./linkedlist.jsx"; // ✅ Linked List page import
import QueuePage from "./queue.jsx";
import BinaryTreePage from "./BinaryTreePage.jsx";
import HeapPage from "./HeapPage.jsx";

export default function DSPage() {
  const [selectedDS, setSelectedDS] = useState("");

  const renderDataStructure = () => {
    switch (selectedDS) {
      case "stack":
        return (
          <div className="w-full h-full overflow-auto">
            <StackPage />
          </div>
        );

      case "linkedlist":
        return (
          <div className="w-full h-full overflow-auto">
            <LinkedListPage />
          </div>
        );

      case "queue":
        return (
          <div className="w-full h-full overflow-auto">
            <QueuePage />
          </div>
        );
        case "binarytree":
         return (
    <div className="w-full h-full overflow-auto">
      <BinaryTreePage />
    </div>
  );
  case "heap":
  return (
    <div className="w-full h-full overflow-auto">
      <HeapPage />
    </div>
  );


      default:
        return (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div className="bg-gradient-to-tr from-indigo-500 via-blue-400 to-purple-500 p-[2px] rounded-2xl">
              <div className="bg-gray-950 rounded-2xl px-10 py-12 shadow-2xl">
                <div className="flex justify-center mb-4">
                  <Network className="w-16 h-16 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  Data Structure Visualizer
                </h2>
                <p className="text-gray-400 mb-6 max-w-sm">
                  Select a data structure from the sidebar to begin visualization.
                  Watch how stacks, queues, and linked lists transform step by step! 🧠✨
                </p>
                <div className="flex items-center justify-center gap-6">
                  <Compass className="w-8 h-8 text-blue-400 animate-pulse" />
                  <Rocket className="w-8 h-8 text-purple-400 animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#0f172a] p-6 border-r border-gray-800 flex-shrink-0">
        <h2 className="text-xl font-bold mb-6 text-indigo-400 tracking-wide">
          Data Structure Panel
        </h2>

        <label className="block mb-2 text-sm">Select Data Structure:</label>
        <select
          value={selectedDS}
          onChange={(e) => setSelectedDS(e.target.value)}
          className="w-full p-2 rounded bg-[#1e293b] text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">Select Data Structure</option>
          <option value="stack">Stack</option>
          <option value="queue">Queue</option>
          <option value="linkedlist">Linked List</option>
          <option value="binarytree">Binary Tree / BST</option>
          <option value="heap">Heap</option>

        </select>

        <button
          onClick={() => setSelectedDS("")}
          className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition font-medium"
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

      {/* Visualization Area */}
      <div className="flex-1 flex overflow-auto">
        <div className="flex-1 min-w-[800px] min-h-full">
          {renderDataStructure()}
        </div>
      </div>
    </div>
  );
}
