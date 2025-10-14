# 📘 AlgoVisualizer

**AlgoVisualizer** is an open-source platform that allows learners and developers to **visualize algorithms** in real-time — from sorting and searching to graph traversal, recursion, and dynamic programming.  
Built with **React + Tailwind CSS**, it aims to make algorithmic concepts more intuitive and interactive.

---

## 🚀 Phased Roadmap

### 🧩 Phase 1 (MVP) — Core Algorithms
> Focus: Build the foundation with essential visualizations.

#### 🔹 Sorting Algorithms
Visualize how different sorting algorithms work step-by-step.

**Algorithms Included:**
- Bubble Sort  
- Selection Sort  
- Insertion Sort  
- Merge Sort  
- Quick Sort  
- Heap Sort  
- Counting / Radix / Bucket Sort  

**Interactive Options:**
- Adjust array size  
- Control visualization speed  
- Choose ascending/descending order  
- Randomize / reverse / nearly-sorted input  

---

#### 🔹 Searching Algorithms
Understand searching logic through dynamic comparisons.

**Algorithms Included:**
- Linear Search  
- Binary Search  

**Interactive Options:**
- Input target value  
- Toggle sorted or unsorted array  
- Highlight comparisons dynamically  

---

#### 🔹 Pathfinding Algorithms (Graph / 2D Grid)
Visualize how algorithms explore and find paths across a grid.

**Algorithms Included:**
- Breadth First Search (BFS)  
- Depth First Search (DFS)  
- Dijkstra’s Algorithm  
- A* Search  

**Interactive Options:**
- Set start and end points  
- Add or remove obstacles (walls)  
- Adjust grid size  
- Change heuristics (Manhattan, Euclidean, etc.)  
- Animate traversal vs shortest path separately  

---

### 🧠 Phase 2 — Advanced Visualizations

#### 🔹 Graph Algorithms
Explore advanced graph operations with interactivity.

**Algorithms Included:**
- Kruskal’s & Prim’s (MST)
- Topological Sort  
- Cycle Detection (Directed / Undirected)  
- Union-Find (Disjoint Set)  
- Shortest Path (Floyd-Warshall, Bellman-Ford)  

**Interactive Options:**
- Weighted/unweighted graph toggle  
- Directed/undirected toggle  
- Add/remove nodes and edges interactively  

---

#### 🔹 Recursion & Backtracking
Watch recursive logic unfold visually.

**Algorithms Included:**
- N-Queens Problem  
- Sudoku Solver  
- Maze Solver  
- Subset Sum  
- Tower of Hanoi  

**Interactive Options:**
- Step-by-step recursion tree visualization  
- Adjust speed and recursion depth  

---

#### 🔹 Data Structures Visualization
Understand core data structures dynamically.

**Structures Included:**
- Stack (push/pop)  
- Queue / Circular Queue  
- Linked List (insert/delete/traverse)  
- Binary Tree / BST  
- AVL / Red-Black Tree (rotations)  
- Heap (insert/delete-min)  
- Hash Table (collision handling)  

**Interactive Options:**
- Animation speed control  
- Toggle pointer/connection visualization  
- Step-by-step operation display  

---

### 🧩 Phase 3 — Dynamic Programming
Step through **state transitions** and **table updates** interactively to understand dynamic programming intuitively.

**Planned Algorithms:**
- Fibonacci (Top-down / Bottom-up)
- Longest Common Subsequence (LCS)
- Knapsack Variants  
- Matrix Chain Multiplication  
- Edit Distance  
- Coin Change  

**Planned Features:**
- DP table visualization  
- Subproblem tracing  
- State transition explanations  

---

## 🧱 Tech Stack

- **Frontend:** React + Vite + Tailwind CSS  
- **Icons:** Lucide React  
- **Animation:** Tailwind transitions & gradient animations  
- **Deployment:** Vercel / Netlify (planned)  
- **Version Control:** GitHub (open source SaaS)

---

## 🪄 UI Features

- Smooth animated gradient background  
- Responsive grid layout  
- SaaS-style “Coming Soon 🚀” overlay for locked features  
- Hover effects with blur, elevation, and glow  
- Fixed hero section + scrollable feature grid  
- Glassmorphism cards  

---

## 🧑‍💻 Development Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/Algo-Visualizer.git
cd Algo-Visualizer
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Run Development Server
```bash
npm run dev
```

### 4️⃣ Open in Browser
Visit: `http://localhost:5173/`

---

## 📂 Project Structure
```
Algo-Visualizer/
├── public/
├── src/
│   ├── algorithms/
│   │   ├── sorting/
│   │   ├── searching/
│   │   ├── pathfinding/
│   │   ├── graph/
│   ├── components/
│   ├── pages/
│   │   ├── sorting/
│   │   ├── searching/
│   │   ├── pathfinding/
│   │   ├── graph/
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   ├── App.jsx
│   ├── Homepage.jsx
│   ├── main.jsx
│   ├── index.css
└── package.json
```

---

## 🌟 Team & Credits

**Project Maintainer:** Aditya Agrawal  
**Event:** Opcode 2025  
**Built With:** ❤️ by PyC  

---

## 📜 License
This project is open-source and available under the **MIT License**.
