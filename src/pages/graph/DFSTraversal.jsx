import React from "react";
import DFSTraversal from "../../components/graph/DFSTraversal";

export default function DFSTraversalPage() {
  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-400 drop-shadow-lg">
        Depth-First Search (DFS) Traversal
      </h1>
      <DFSTraversal />
    </div>
  );
}
