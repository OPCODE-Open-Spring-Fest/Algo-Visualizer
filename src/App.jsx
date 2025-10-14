import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UnionFindPage from "../src/pages/graph/UnionFind.jsx"; // ✅ Import Union-Find Page
import SortingPage from "./pages/sorting/SortingPage";
import Homepage from "./pages/Homepage.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/graph/union-find" element={<UnionFindPage />} /> {/* ✅ Added route */}
        <Route path="/sorting" element={<SortingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
