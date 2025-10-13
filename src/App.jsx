import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SortingPage from "./pages/sorting/SortingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sorting" element={<SortingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
