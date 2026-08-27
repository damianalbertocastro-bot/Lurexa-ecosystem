"use client";

import React from "react";

export interface SkillScore {
  skill: string;
  score: number; // 0 to 100
  level?: string; // e.g. "A1", "A2", "B1", "B2", "C1", "C2"
}

export interface SkillRadarChartProps {
  skills: SkillScore[];
  size?: number;
  className?: string;
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
  skills,
  size = 320,
  className = "",
}) => {
  const count = skills.length;
  if (count < 3) return null;

  const center = size / 2;
  const radius = center - 45; // Padding for outer skill labels
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (index: number, valueRatio: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const x = center + radius * valueRatio * Math.cos(angle);
    const y = center + radius * valueRatio * Math.sin(angle);
    return { x, y };
  };

  // Generate background ring polygons
  const gridPolygons = levels.map((lvl) => {
    return skills
      .map((_, i) => {
        const { x, y } = getCoordinates(i, lvl);
        return `${x},${y}`;
      })
      .join(" ");
  });

  // Generate data polygon points
  const dataPoints = skills.map((s, i) => {
    const ratio = Math.max(0.1, Math.min(1.0, s.score / 100));
    return getCoordinates(i, ratio);
  });

  const polygonString = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        role="img"
        aria-label="Skill Radar Chart displaying learner proficiency across English competencies"
      >
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--lx-primary, #592bd6)" stopOpacity="0.45" />
            <stop offset="50%" stopColor="var(--lx-secondary, #1d5add)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--lx-accent, #12cdd4)" stopOpacity="0.25" />
          </linearGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Concentric Grid Lines */}
        {gridPolygons.map((points, idx) => (
          <polygon
            key={idx}
            points={points}
            fill={idx === levels.length - 1 ? "rgba(238, 243, 255, 0.4)" : "none"}
            stroke="var(--lx-border, #dfe7fb)"
            strokeWidth={idx === levels.length - 1 ? "1.5" : "1"}
            strokeDasharray={idx < levels.length - 1 ? "3 3" : undefined}
          />
        ))}

        {/* Axis Spokes */}
        {skills.map((_, i) => {
          const { x, y } = getCoordinates(i, 1.0);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="var(--lx-border, #dfe7fb)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Area Polygon */}
        <polygon
          points={polygonString}
          fill="url(#radarGradient)"
          stroke="var(--lx-primary, #592bd6)"
          strokeWidth="2.5"
          filter="url(#radarGlow)"
          className="transition-all duration-700 ease-out"
        />

        {/* Data Points */}
        {dataPoints.map((point, idx) => (
          <g key={idx} className="transition-all duration-500">
            <circle
              cx={point.x}
              cy={point.y}
              r="4.5"
              fill="var(--lx-surface, #ffffff)"
              stroke="var(--lx-primary, #592bd6)"
              strokeWidth="2"
            />
          </g>
        ))}

        {/* Axis Labels */}
        {skills.map((item, i) => {
          const labelCoord = getCoordinates(i, 1.18);
          return (
            <text
              key={item.skill}
              x={labelCoord.x}
              y={labelCoord.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[var(--lx-ink,#071d67)] text-[10px] font-black uppercase tracking-wider"
            >
              {item.skill}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
