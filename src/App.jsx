import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import UnionFindPage from "../src/pages/graph/UnionFind.jsx"; // ✅ Import Union-Find Page
import SortingPage from "./pages/sorting/SortingPage";
import GraphPage from "./pages/graph/GraphPage";
import Homepage from "./pages/Homepage.jsx";
import DSPage from "./pages/dataStructure/datastructurePage.jsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* <Route path="/graph/union-find" element={<UnionFindPage />} /> */}
        <Route path="/sorting" element={<SortingPage />} />
        <Route path="/data-structures" element={<DSPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;