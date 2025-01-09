"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import * as d3 from "d3"

interface RadarChartProps {
  data: {
    skill: string
    score: number
    maxScore: number
  }[]
  width?: number
  height?: number
}

export function RadarChart({ data, width = 400, height = 400 }: RadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    const margin = 50
    const chartWidth = width - 2 * margin
    const chartHeight = height - 2 * margin
    const radius = Math.min(chartWidth, chartHeight) / 2

    const svg = d3
      .select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)

    // Scales
    const angleScale = d3
      .scalePoint()
      .domain(data.map(d => d.skill))
      .range([0, 2 * Math.PI])

    const radiusScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.maxScore) || 100])
      .range([0, radius])

    // Draw background circles
    const circles = [0.2, 0.4, 0.6, 0.8, 1]
    circles.forEach(circle => {
      svg
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", radius * circle)
        .attr("fill", "none")
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 1)
    })

    // Draw axis lines
    data.forEach(d => {
      const angle = angleScale(d.skill)
      if (angle === undefined) return

      svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", radius * Math.cos(angle - Math.PI / 2))
        .attr("y2", radius * Math.sin(angle - Math.PI / 2))
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 1)
    })

    // Draw labels
    data.forEach(d => {
      const angle = angleScale(d.skill)
      if (angle === undefined) return

      const x = (radius + 20) * Math.cos(angle - Math.PI / 2)
      const y = (radius + 20) * Math.sin(angle - Math.PI / 2)

      svg
        .append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#4b5563")
        .text(d.skill)
    })

    // Draw data points and path
    const line = d3
      .lineRadial<typeof data[0]>()
      .angle(d => angleScale(d.skill) || 0)
      .radius(d => radiusScale(d.score))
      .curve(d3.curveLinearClosed)

    const path = svg
      .append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "rgb(0,0,0)")
      .attr("fill-opacity", 0.1)
      .attr("stroke", "#000")
      .attr("stroke-width", 2)

    const pathLength = path.node()?.getTotalLength() || 0
    path
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0)

    data.forEach(d => {
      const angle = angleScale(d.skill)
      if (angle === undefined) return

      const x = radiusScale(d.score) * Math.cos(angle - Math.PI / 2)
      const y = radiusScale(d.score) * Math.sin(angle - Math.PI / 2)

      svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 4)
        .attr("fill", "#000")
    })
  }, [data, width, height])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ position: 'relative' }}
    >
      <svg ref={svgRef} width={width} height={height} />
    </motion.div>
  )
}
