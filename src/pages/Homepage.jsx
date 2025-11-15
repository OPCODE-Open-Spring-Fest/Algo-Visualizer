import React from "react";
import { ArrowRight, Github } from "lucide-react";
import sort from "../assets/sorting.png"
import { useNavigate } from "react-router-dom";


const sections = [
  {
    title: "Sorting Algorithms",
    description:
      "Visualize step-by-step how sorting algorithms organize data efficiently.",
    phase: "Phase 1 (MVP)",
    img: "https://tamimehsan.github.io/AlgorithmVisualizer/images/sort.png?height=200&width=300",
    link: "/sorting",
    flag: false
  },
  {
    title: "Searching Algorithms",
    description:
      "Understand linear and binary search methods through live visualization.",
    phase: "Phase 1 (MVP)",
    img: "/searching.png",
    link: "/searching",
    flag: false
  },
  {
    title: "Sliding Window Algorithms",
    description:
      "Visualize how the sliding window technique efficiently processes subarrays and substrings with dynamic window movement.",
    phase: "Phase 1 (MVP)",
    img: "/Sliding-Window.png",
    link: "/sliding-window",
    flag: false
  },
  {
    title: "Pathfinding Algorithms",
    description:
      "Watch how A*, Dijkstra and BFS explore grids to find the optimal path.",
    phase: "Phase 1 (MVP)",
    img: "",
    link: "/pathfinding",
    flag: true
  },
  {
    title: "Graph Algorithms",
    description:
      "Explore BFS, DFS, Kruskal’s, Prim’s, and now Union-Find — all brought to life interactively.",
    phase: "Phase 2",
    img: "/graph.png",
    link: "/graph",
    flag: false
  },
  {
    title: "Recursion & Backtracking",
    description:
      "Visualize recursive calls and backtracking patterns like N-Queens or Sudoku.",
    phase: "Phase 2",
    img: "",
    route: "",
    link: "/recursion",
    flag: true
  },
  {
    title: "Data Structures Visualization",
    description:
      "Interactively understand stacks, queues, linked lists, trees, and heaps.",
    phase: "Phase 2",
    img: "",
    route: "",
    link: "/data-structures",
    flag: true
  },
  {
    title: "Dynamic Programming",
    description:
      "Step through state transitions and table updates to grasp DP intuitively.",
    phase: "Phase 3",
    img: "https://miro.medium.com/v2/1*3NIwCTE7Nudy_wV-zF_nWQ.jpeg",
    route: "/dynamic-programming",
    link: "/dynamic-programming",
    flag: false,
  },
  {
    title: "Tree Traversal",
    description:
      "Visualize inorder, preorder, and postorder tree traversals step by step.",
    phase: "Phase 2",
    img: "/Tree-Traversal.png",
    link: "/tree",
    flag: false,
  },
  {
    title: "Greedy Algorithms",
    description:
      "Watch how greedy choices lead to optimal solutions in problems like Fractional Knapsack.",
    phase: "Phase 2",
    img: "",
    link: "/greedy",
    flag: false,
  },
];

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center overflow-x-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1b0b3a] via-[#120a2a] to-black animate-gradient-x bg-[length:400%_400%] -z-20" />
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm -z-10" />

      {/* Hero Section */}
      <header className="flex flex-col items-center text-center mt-24 px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-xl">
          AlgoVisualizer
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
          Experience algorithms like never before — visualize, interact, and
          learn through real-time simulations. An open-source SaaS for
          developers and learners.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-full flex items-center gap-2 shadow-lg hover:shadow-indigo-500/50 transition-all duration-300"
          >
            Explore Now <ArrowRight size={18} />
          </button>
          <a
            href="https://github.com/OPCODE-Open-Spring-Fest/Algo-Visualizer"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-400 hover:bg-white/10 text-gray-200 font-semibold rounded-full flex items-center gap-2 transition-all duration-300"
          >
            <Github size={18} /> View on GitHub
          </a>
        </div>
      </header>

      {/* Sections Grid */}
      <section className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-6 pb-32">
        {sections.map((section, index) => (
          <div
            key={index}
            onClick={() => section.link && navigate(section.link)}
            className="relative group bg-white/10 border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:shadow-indigo-500/40 cursor-pointer transition-all duration-300 backdrop-blur-md hover:-translate-y-2"
          >
            {/* Image */}
            <img
              src={section.img}
              alt={section.title}
              className="w-full h-52 object-cover opacity-80 group-hover:opacity-50 transition-all duration-300"
            />

            {/* Text Content */}
            <div className="p-6">
              <p className="text-xs text-indigo-400 font-semibold mb-1">
                {section.phase}
              </p>
              <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
              <p className="text-gray-300 text-sm leading-snug">
                {section.description}
              </p>

              {/* Explore Button */}
              <button
                onClick={() =>
                  section.link
                    ? navigate(section.link)
                    : alert("Coming soon 🚀")
                }
                className="mt-4 text-indigo-400 font-semibold flex items-center gap-1 hover:gap-2 cursor-pointer transition-all"
              >
                Explore <ArrowRight size={16} />
              </button>
            </div>

            {/* SaaS-style “Coming Soon” Overlay */}
            {section.flag && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold bg-gradient-to-br from-indigo-700/70 to-purple-900/70 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Coming Soon 🚀
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-white/10 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} AlgoVisualizer — Crafted with ❤️ for
        opcode2025 by PyC | Project Maintainer: Aditya Agrawal
      </footer>
    </div>
  );
};

export default Homepage;
