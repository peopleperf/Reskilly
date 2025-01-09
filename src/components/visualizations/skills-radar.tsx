"use client"

import { useEffect, useRef, useCallback } from 'react'
import * as d3 from 'd3'

interface SkillData {
  skill: string
  currentRelevance: number
  futureRelevance: number
}

interface SkillsRadarProps {
  skills: SkillData[]
  width?: number
  height?: number
}

export function SkillsRadar({ skills, width = 600, height = 600 }: SkillsRadarProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  // Increase margins to accommodate labels
  const margin = { top: 80, right: 150, bottom: 80, left: 150 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Adjust radius to leave more space for labels
  const radius = Math.min(chartWidth, chartHeight) / 2.5;
  
  // Improve text wrapping for better readability
  const wrapText = (text: string, maxLength: number) => {
    const words = text.split(/\s+/);
    if (words.length <= 2) return text;
    
    let lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
      if (currentLine.length + words[i].length + 1 <= maxLength) {
        currentLine += " " + words[i];
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);
    return lines.join('\n');
  };

  // Update the drawChart function
  const drawChart = useCallback(() => {
    if (!svgRef.current || !skills.length) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove()

    // Calculate the angle slice based on the number of skills
    const angleSlice = (2 * Math.PI) / skills.length;

    // Create SVG with proper viewBox for better scaling
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width/2}, ${height/2})`)

    // Scales
    const angleScale = d3.scalePoint()
      .domain(skills.map(d => d.skill))
      .range([0, 2 * Math.PI - (2 * Math.PI / skills.length)]) // Adjust range to close the circle

    const radiusScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, radius])

    // Draw background circles
    const circles = [20, 40, 60, 80, 100]
    circles.forEach(circle => {
      svg.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', radiusScale(circle))
        .attr('fill', 'none')
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4')
    })

    // Update label positioning with improved spacing
    const labels = svg
      .selectAll('.axis-label')
      .data(skills)
      .join('text')
      .attr('class', 'axis-label')
      .attr('x', (d, i) => {
        const angle = angleScale(d.skill) || (i * angleSlice);
        const labelRadius = radius * 1.4; // Increase distance from center
        return labelRadius * Math.cos(angle - Math.PI / 2);
      })
      .attr('y', (d, i) => {
        const angle = angleScale(d.skill) || (i * angleSlice);
        const labelRadius = radius * 1.4; // Increase distance from center
        return labelRadius * Math.sin(angle - Math.PI / 2);
      })
      .attr('text-anchor', (d, i) => {
        const angle = angleScale(d.skill) || (i * angleSlice);
        const cos = Math.cos(angle - Math.PI / 2);
        if (Math.abs(cos) < 0.1) return 'middle';
        return cos > 0 ? 'start' : 'end';
      })
      .attr('dominant-baseline', (d, i) => {
        const angle = angleScale(d.skill) || (i * angleSlice);
        const sin = Math.sin(angle - Math.PI / 2);
        if (Math.abs(sin) < 0.1) return sin > 0 ? 'auto' : 'hanging';
        return 'middle';
      })
      .text(d => wrapText(d.skill, 15))
      .attr('fill', '#4B5563')
      .style('font-size', '14px') // Increase font size
      .style('font-weight', '500'); // Make text slightly bolder

    // Draw axis lines with proper angle calculation
    skills.forEach((d, i) => {
      const angle = angleScale(d.skill) || (i * angleSlice);
      svg.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', radius * Math.cos(angle - Math.PI / 2))
        .attr('y2', radius * Math.sin(angle - Math.PI / 2))
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 1)
    });

    // Update line generators to use proper angle calculation
    const currentLine = d3.lineRadial<SkillData>()
      .angle((d, i) => angleScale(d.skill) || (i * angleSlice))
      .radius(d => radiusScale(d.currentRelevance))
      .curve(d3.curveLinearClosed)

    const futureLine = d3.lineRadial<SkillData>()
      .angle((d, i) => angleScale(d.skill) || (i * angleSlice))
      .radius(d => radiusScale(d.futureRelevance))
      .curve(d3.curveLinearClosed)

    // Draw current skills area
    const currentPath = svg.append('path')
      .datum(skills)
      .attr('d', currentLine)
      .attr('fill', 'rgba(59, 130, 246, 0.2)')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)

    // Animate current skills
    const currentLength = currentPath.node()?.getTotalLength() || 0
    currentPath
      .attr('stroke-dasharray', `${currentLength} ${currentLength}`)
      .attr('stroke-dashoffset', currentLength)
      .transition()
      .duration(1000)
      .attr('stroke-dashoffset', 0)

    // Draw future skills area
    const futurePath = svg.append('path')
      .datum(skills)
      .attr('d', futureLine)
      .attr('fill', 'rgba(34, 197, 94, 0.2)')
      .attr('stroke', '#22c55e')
      .attr('stroke-width', 2)

    // Animate future skills
    const futureLength = futurePath.node()?.getTotalLength() || 0
    futurePath
      .attr('stroke-dasharray', `${futureLength} ${futureLength}`)
      .attr('stroke-dashoffset', futureLength)
      .transition()
      .duration(1000)
      .delay(500)
      .attr('stroke-dashoffset', 0)

    // Update legend position to avoid overlap
    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${radius + 20}, ${-radius})`);

    // Current skills legend
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', 'rgba(59, 130, 246, 0.2)')
      .attr('stroke', '#3b82f6')

    legend.append('text')
      .attr('x', 20)
      .attr('y', 10)
      .attr('font-size', '12px')
      .attr('fill', '#4b5563')
      .text('Current Relevance')

    // Future skills legend
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 20)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', 'rgba(34, 197, 94, 0.2)')
      .attr('stroke', '#22c55e')

    legend.append('text')
      .attr('x', 20)
      .attr('y', 30)
      .attr('font-size', '12px')
      .attr('fill', '#4b5563')
      .text('Future Relevance')

  }, [skills, width, height, chartWidth, chartHeight, radius])

  // Add useEffect to trigger chart drawing
  useEffect(() => {
    drawChart()
  }, [drawChart])

  return (
    <div className="w-full overflow-x-auto">
      <svg 
        ref={svgRef}
        width={width}
        height={height}
        className="mx-auto"
      />
    </div>
  )
} 