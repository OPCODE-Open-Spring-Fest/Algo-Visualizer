import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import UnionFindPage from "../src/pages/graph/UnionFind.jsx"; // ✅ Import Union-Find Page
import SortingPage from "./pages/sorting/SortingPage";
import GraphPage from "./pages/graph/GraphPage";
import Homepage from "./pages/Homepage.jsx";
import DSPage from "./pages/dataStructure/datastructurePage.jsx"
import DynamicProgrammingPage from "./pages/dynamic-programming/DyanmicProgrammingPage.jsx";
import Searchingpage from "./pages/searching/searchingPage";
import RecursionPage from "./pages/Recursion/RecursionPage";
import Treepage from "./pages/Tree/Treepage";
import SlidingWindowPage from "./pages/sliding-window/SlidingWindowPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* <Route path="/graph/union-find" element={<UnionFindPage />} /> */}
        <Route path="/sorting" element={<SortingPage />} />
        <Route path="/searching" element={<Searchingpage />} />
        <Route path="/data-structures" element={<DSPage/>}/>
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/dynamic-programming" element={<DynamicProgrammingPage />} />
        <Route path="/recursion" element={<RecursionPage/>}/>
        <Route path="/tree" element={<Treepage />} />
        <Route path="/sliding-window" element={<SlidingWindowPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;