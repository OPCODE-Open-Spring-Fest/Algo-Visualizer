import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import UnionFindPage from "../src/pages/graph/UnionFind.jsx"; // ✅ Import Union-Find Page
import SortingPage from "./pages/sorting/SortingPage";
import GraphPage from "./pages/graph/GraphPage";
import Searchingpage from "./pages/searching/searchingPage";
import Homepage from "./pages/Homepage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* <Route path="/graph/union-find" element={<UnionFindPage />} /> */}
        <Route path="/sorting" element={<SortingPage />} />
        <Route path="/searching" element={<Searchingpage />} />
        <Route path="/graph" element={<GraphPage />} />
      </Routes>
    </Router>
  );
}

export default App;
