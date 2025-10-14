// src/algorithms/graph/unionFind.js

export class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
    this.steps = []; // For visualization steps
  }

  find(x) {
    this.steps.push({ type: "find-start", node: x });
    if (this.parent[x] !== x) {
      const root = this.find(this.parent[x]);
      this.steps.push({
        type: "path-compression",
        node: x,
        newParent: root,
      });
      this.parent[x] = root;
    }
    this.steps.push({ type: "find-end", node: x, root: this.parent[x] });
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    this.steps.push({
      type: "union-start",
      x,
      y,
      rootX,
      rootY,
    });

    if (rootX === rootY) {
      this.steps.push({ type: "same-set", x, y });
      return;
    }

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
      this.steps.push({
        type: "union",
        parent: rootY,
        child: rootX,
      });
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
      this.steps.push({
        type: "union",
        parent: rootX,
        child: rootY,
      });
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
      this.steps.push({
        type: "union-rank",
        parent: rootX,
        child: rootY,
      });
    }
  }

  getSteps() {
    return this.steps;
  }
}
