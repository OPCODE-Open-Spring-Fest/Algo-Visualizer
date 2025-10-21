import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import UnionFindPage from "../src/pages/graph/UnionFind.jsx"; // ✅ Import Union-Find Page
import SortingPage from "./pages/sorting/SortingPage";
import GraphPage from "./pages/graph/GraphPage";
import Homepage from "./pages/Homepage.jsx";
import DSPage from "./pages/dataStructure/datastructurePage.jsx"
import DynamicProgrammingPage from "./pages/dynamic-programming/DyanmicProgrammingPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* <Route path="/graph/union-find" element={<UnionFindPage />} /> */}
        <Route path="/sorting" element={<SortingPage />} />
        <Route path="/data-structures" element={<DSPage/>}/>
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/dynamic-programming" element={<DynamicProgrammingPage />} />
      </Routes>
    </Router>
  );
}

export default App;