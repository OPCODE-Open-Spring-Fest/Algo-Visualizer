import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "../src/pages/Homepage.jsx";
import UnionFindPage from "../src/pages/graph/UnionFind.jsx"; // ✅ Import Union-Find Page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/graph/union-find" element={<UnionFindPage />} /> {/* ✅ Added route */}
      </Routes>
    </Router>
  );
}

export default App;
