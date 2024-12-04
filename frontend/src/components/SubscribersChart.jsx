import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const SubscribersChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Remove any existing SVG elements
    d3.select(chartRef.current).select("svg").remove();

    // Chart dimensions and settings
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    // Create the SVG container
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Create the color scale with minimalist tones
    const color = d3
      .scaleOrdinal()
      .domain(["Subscribers", "Non-Subscribers"])
      .range(["#A0AEC0", "#718096"]); // Softer gray and slate tones

    // Calculate the pie angles
    const pie = d3.pie().value((d) => d.value);

    // Create arc generator
    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius);

    // Prepare data
    const chartData = pie([
      { label: "Subscribers", value: data.subscribers },
      { label: "Non-Subscribers", value: data.nonSubscribers },
    ]);

    // Append arcs
    svg
      .selectAll("path")
      .data(chartData)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.label))
      .attr("stroke", "#E2E8F0") // Light stroke for better contrast
      .attr("stroke-width", 2);

    // Add text labels
    svg
      .selectAll("text")
      .data(chartData)
      .join("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text((d) => `${d.data.label}: ${d.data.value}`)
      .style("font-size", "12px")
      .style("fill", "#2D3748"); // Darker text for readability
  }, [data]);

  return <div ref={chartRef}></div>;
};

export default SubscribersChart;
