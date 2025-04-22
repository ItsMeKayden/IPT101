import React, { useState } from "react";
import { Card, CardContent } from './Card';

export default function CircleGraph() {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  
  // Data for the sales entries
  const salesEntries = [
    { id: 1, name: "SHAKANEBALOCK" },
    { id: 2, name: "SHAKANEBALOCK" },
    { id: 3, name: "SHAKANEBALOCK" },
    { id: 4, name: "SHAKANEBALOCK" },
  ];

  // Enhanced color legend with values
  const colorLegend = [
    { color: "bg-red-500", label: "Red", value: "35%" },
    { color: "bg-orange-400", label: "Orange", value: "25%" },
    { color: "bg-yellow-300", label: "Yellow", value: "20%" },
    { color: "bg-green-400", label: "Green", value: "15%" },
    { color: "bg-blue-400", label: "Blue", value: "5%" },
  ];

  // SVG circle graph parameters
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { percentage: 35, color: "#EF4444" },
    { percentage: 25, color: "#FB923C" },
    { percentage: 20, color: "#FACC15" },
    { percentage: 15, color: "#4ADE80" },
    { percentage: 5, color: "#60A5FA" },
  ];

  let cumulativePercentage = 0;

  return (
    <div className="w-full max-w-[892px]">
      <Card className="w-full bg-white rounded-[25px] shadow-[inset_0px_4px_4px_#00000040,0px_4px_4px_#00000040] p-6">
        <CardContent className="p-0">
          <div className="relative">
            <h2 className="mb-4 [font-family:'Cinzel',Helvetica] font-bold text-[#270a4e] text-[40px]">
              Sales Overview
            </h2>

            <div className="flex flex-wrap gap-4 mb-6">
              {colorLegend.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-4 h-4 ${item.color} rounded-full mr-2`}></div>
                  <span className="text-sm text-[#270a4e]">
                    {item.label} ({item.value})
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              <div className="relative w-[250px] h-[250px] flex items-center justify-center">
                <svg
                  width="250"
                  height="250"
                  viewBox="0 0 250 250"
                  className="transform transition-transform duration-300 ease-out"
                  style={{
                    transform: hoveredSegment !== null ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {segments.map((segment, index) => {
                    const segmentPercentage = segment.percentage;
                    const offset = circumference * (1 - cumulativePercentage / 100);
                    cumulativePercentage += segmentPercentage;
                    
                    return (
                      <circle
                        key={index}
                        cx="125"
                        cy="125"
                        r={radius}
                        fill="transparent"
                        stroke={segment.color}
                        strokeWidth="40"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 125 125)"
                        className="transition-all duration-300 ease-out"
                        style={{
                          opacity: hoveredSegment === null || hoveredSegment === index ? 1 : 0.6,
                        }}
                        onMouseEnter={() => setHoveredSegment(index)}
                        onMouseLeave={() => setHoveredSegment(null)}
                      />
                    );
                  })}
                  
                  <text
                    x="125"
                    y="125"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xl font-bold fill-[#270a4e]"
                  >
                    {hoveredSegment !== null ? `${segments[hoveredSegment].percentage}%` : "Total"}
                  </text>
                </svg>
              </div>

              <div className="flex-1">
                {salesEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="mb-6 [font-family:'Cinzel',Helvetica] font-bold text-[#270a4e] text-xl hover:text-[#4F46E5] transition-colors duration-200"
                  >
                    - {entry.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};