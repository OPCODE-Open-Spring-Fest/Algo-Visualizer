// src/algorithms/graph/kruskal.js

class DSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return false;

    if (this.rank[rx] < this.rank[ry]) this.parent[rx] = ry;
    else if (this.rank[rx] > this.rank[ry]) this.parent[ry] = rx;
    else {
      this.parent[ry] = rx;
      this.rank[rx]++;
    }
    return true;
  }

  getState() {
    return [...this.parent];
  }
}

// 🧠 Generator that yields every visualization step
export function* kruskalSteps(edges, nodeCount) {
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const dsu = new DSU(nodeCount);
  const mst = [];

  for (let edge of sortedEdges) {
    yield { type: "consider", edge, dsu: dsu.getState() };

    const merged = dsu.union(edge.from - 1, edge.to - 1);
    if (merged) {
      mst.push(edge);
      yield { type: "add", edge, mst: [...mst], dsu: dsu.getState() };
    } else {
      yield { type: "skip", edge, dsu: dsu.getState() };
    }
  }

  yield { type: "done", mst, dsu: dsu.getState() };
}
