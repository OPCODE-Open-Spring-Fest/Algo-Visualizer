import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function CycleInGraph({ nodes, edges, highlight }) {
  const svgRef = useRef();

  useEffect(() => {
    if (nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = 700;
    const height = 500;

    const simulation = d3
      .forceSimulation(nodes.map((id) => ({ id })))
      .force(
        "link",
        d3
          .forceLink(edges.map((e) => ({ source: e.u, target: e.v })))
          .id((d) => d.id)
          .distance(150)
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const linkGroup = svg
      .append("g")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");

    const nodeGroup = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 25)
      .attr("fill", "#1e293b")
      .attr("stroke", "#10b981")
      .attr("stroke-width", 3);

    const textGroup = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text((d) => d)
      .attr("font-size", 16)
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("dy", 5);

    // Arrow marker for directed edges
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 20)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#9ca3af");

    simulation.on("tick", () => {
      linkGroup
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeGroup.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      textGroup.attr("x", (d) => d.x).attr("y", (d) => d.y + 4);
    });

    return () => simulation.stop();
  }, [nodes, edges]);

  // Highlight logic
  useEffect(() => {
    if (!highlight || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);

    const nodeSel = svg.selectAll("circle");
    const linkSel = svg.selectAll("line");

    nodeSel.attr("fill", (d) => {
      if (highlight.type === "visit" && d === highlight.node) return "#3b82f6";
      if (highlight.type === "cycle-found" && d === highlight.node)
        return "#ef4444";
      return "#1e293b";
    });

    linkSel.attr("stroke", (d) => {
      if (
        highlight.type === "explore" &&
        d.source.id === highlight.u &&
        d.target.id === highlight.v
      )
        return "#22d3ee";
      if (
        highlight.type === "cycle-found" &&
        d.source.id === highlight.u &&
        d.target.id === highlight.v
      )
        return "#ef4444";
      return "#555";
    });
  }, [highlight, nodes]);

  return (
    <div className="mt-8 flex justify-center">
      <svg
        ref={svgRef}
        width={750}
        height={500}
        className="bg-gray-900 rounded-xl shadow-lg border border-gray-700"
      ></svg>
    </div>
  );
}
