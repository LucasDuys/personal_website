'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/* ---------- Stage Data ---------- */

interface Stage {
  id: string;
  label: string;
  sublabel: string;
  color: string;
  tooltip: string;
}

const stages: Stage[] = [
  {
    id: 'agent',
    label: 'AGENT',
    sublabel: 'governed identity',
    color: '#22D3EE',
    tooltip: 'A governed AI agent / acts under its own identity / never above the user',
  },
  {
    id: 'permissions',
    label: 'PERMISSIONS',
    sublabel: 'same as a person',
    color: '#8B5CF6',
    tooltip: 'Inherits a role / same permissions + consent as a human / least privilege',
  },
  {
    id: 'connectors',
    label: 'CONNECTORS',
    sublabel: 'mounted, ACL-aware',
    color: '#FBBF24',
    tooltip: 'Drive / Slack / Notion / GitHub / Gmail / Postgres / ACL pre-filter + post-check',
  },
  {
    id: 'gate',
    label: 'GATE',
    sublabel: 'autonomy spectrum',
    color: '#4ADE80',
    tooltip: 'task · decision · autonomous / per-run guardrails / wall-clock + token budgets',
  },
  {
    id: 'act',
    label: 'ACT',
    sublabel: 'read / write',
    color: '#E8E6E3',
    tooltip: 'Connector read + governed write / every action written to the audit chain',
  },
];

/* ---------- Icons (simple SVG shapes) ---------- */

function StageIcon({ stageId, color, active }: { stageId: string; color: string; active: boolean }) {
  const fill = active ? color : '#777788';
  const stroke = active ? color : '#777788';

  switch (stageId) {
    case 'agent':
      // Chip / processor icon
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="8" y="8" width="12" height="12" rx="2" stroke={stroke} strokeWidth="1.5" fill={active ? `${color}22` : 'none'} />
          <circle cx="14" cy="14" r="2.5" fill={fill} />
          <line x1="14" y1="4" x2="14" y2="8" stroke={stroke} strokeWidth="1.2" />
          <line x1="14" y1="20" x2="14" y2="24" stroke={stroke} strokeWidth="1.2" />
          <line x1="4" y1="14" x2="8" y2="14" stroke={stroke} strokeWidth="1.2" />
          <line x1="20" y1="14" x2="24" y2="14" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case 'permissions':
      // Key icon
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="9" cy="11" r="5" stroke={stroke} strokeWidth="1.5" fill="none" />
          <circle cx="9" cy="11" r="1.6" fill={fill} />
          <path d="M13 14 L22 23" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="18" y1="19" x2="21" y2="16" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'connectors':
      // Plug / link icon
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M10 18 L7 21 a3.5 3.5 0 0 1-5-5 L5 13" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M18 10 L21 7 a3.5 3.5 0 0 0-5-5 L13 5" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <line x1="10" y1="18" x2="18" y2="10" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'gate':
      // Shield with check
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 3 L23 7 V14 C23 19 19 23 14 25 C9 23 5 19 5 14 V7 Z" stroke={stroke} strokeWidth="1.5" fill={active ? `${color}22` : 'none'} strokeLinejoin="round" />
          <path d="M10 14 L13 17 L18 11" stroke={fill} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'act':
      // Lightning / spark icon
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M16 3 L10 15 H15 L12 25 L22 12 H16 Z" stroke={stroke} strokeWidth="1.5" fill={active ? `${color}22` : 'none'} strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

/* ---------- Tooltip ---------- */

function Tooltip({ stage, visible }: { stage: Stage; visible: boolean }) {
  if (!visible) return null;

  const lines = stage.tooltip.split(' / ');

  return (
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-20 pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 200ms' }}
    >
      <div
        className="px-3 py-2 rounded-md border font-mono text-[10px] leading-relaxed whitespace-nowrap"
        style={{
          background: '#0E0E14',
          borderColor: stage.color,
          color: '#E8E6E3',
          boxShadow: `0 0 12px ${stage.color}20`,
        }}
      >
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Main Component ---------- */

export function AgentRuntimeFlow() {
  const [activeStage, setActiveStage] = useState<number>(-1);
  const [hoveredStage, setHoveredStage] = useState<number>(-1);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive check
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Auto-cycling animation
  useEffect(() => {
    let stageIndex = 0;
    const interval = setInterval(() => {
      setActiveStage(stageIndex % stages.length);
      stageIndex++;
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Layout calculations
  const getNodePosition = useCallback(
    (index: number): { x: number; y: number } => {
      if (isMobile) {
        // Vertical stack
        const x = 60;
        const y = 40 + index * 90;
        return { x, y };
      }
      // Horizontal layout: 5 nodes evenly spaced in 1000px width
      const padding = 80;
      const spacing = (1000 - padding * 2) / (stages.length - 1);
      return { x: padding + index * spacing, y: 150 };
    },
    [isMobile]
  );

  const nodeSize = 80;
  const halfNode = nodeSize / 2;
  const auditY = 290; // y of the hash-chained audit rail (desktop)

  // SVG viewBox
  const viewBox = isMobile ? '0 0 200 500' : '0 0 1000 380';

  // Build connection paths
  const getConnectionPath = useCallback(
    (fromIdx: number, toIdx: number): string => {
      const from = getNodePosition(fromIdx);
      const to = getNodePosition(toIdx);

      if (isMobile) {
        const startY = from.y + halfNode;
        const endY = to.y - halfNode;
        const midY = (startY + endY) / 2;
        return `M ${from.x} ${startY} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${endY}`;
      }

      const startX = from.x + halfNode;
      const endX = to.x - halfNode;
      const midX = (startX + endX) / 2;
      return `M ${startX} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${endX} ${to.y}`;
    },
    [getNodePosition, isMobile, halfNode]
  );

  const connections = stages.slice(0, -1).map((_, i) => ({ from: i, to: i + 1 }));

  const isConnectionActive = (fromIdx: number): boolean => activeStage === fromIdx;

  return (
    <div ref={containerRef} className="w-full max-w-[1000px] mx-auto relative">
      {/* CSS Animations */}
      <style>{`
        @keyframes arfDashFlow { to { stroke-dashoffset: -40; } }
        @keyframes arfPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      `}</style>

      <svg
        viewBox={viewBox}
        className="w-full h-auto"
        style={{ maxHeight: isMobile ? '500px' : '380px' }}
      >
        {/* Connection lines */}
        {connections.map((conn, i) => {
          const path = getConnectionPath(conn.from, conn.to);
          const active = isConnectionActive(conn.from);
          const fromColor = stages[conn.from].color;

          return (
            <g key={`conn-${i}`}>
              <path d={path} fill="none" stroke="#555566" strokeOpacity={0.2} strokeWidth={1.5} strokeDasharray="6 4" />
              <path
                d={path}
                fill="none"
                stroke={fromColor}
                strokeWidth={2}
                strokeDasharray="8 4"
                style={{
                  opacity: active ? 0.8 : 0,
                  transition: 'opacity 300ms',
                  animation: active ? 'arfDashFlow 0.8s linear infinite' : 'none',
                }}
              />
              {active && (
                <circle r="5" fill={fromColor} opacity={0.9}>
                  <animateMotion dur="1.6s" repeatCount="1" fill="freeze">
                    <mpath href={`#arfMotionPath-${i}`} />
                  </animateMotion>
                  <animate attributeName="opacity" values="0.9;1;0.9" dur="0.5s" repeatCount="indefinite" />
                </circle>
              )}
              <path id={`arfMotionPath-${i}`} d={path} fill="none" stroke="none" />
            </g>
          );
        })}

        {/* Hash-chained audit rail (desktop only) */}
        {!isMobile && (
          <g>
            {/* rail line */}
            <line
              x1={getNodePosition(0).x}
              y1={auditY}
              x2={getNodePosition(stages.length - 1).x}
              y2={auditY}
              stroke="#555566"
              strokeOpacity={0.25}
              strokeWidth={1.5}
              strokeDasharray="2 4"
            />
            {/* chain blocks, one under each node */}
            {stages.map((stage, i) => {
              const pos = getNodePosition(i);
              const isActive = activeStage === i;
              return (
                <g key={`audit-${i}`}>
                  {/* drop line from node to rail */}
                  <line
                    x1={pos.x}
                    y1={pos.y + halfNode}
                    x2={pos.x}
                    y2={auditY - 7}
                    stroke={isActive ? stage.color : '#555566'}
                    strokeOpacity={isActive ? 0.5 : 0.12}
                    strokeWidth={1}
                    style={{ transition: 'stroke-opacity 300ms' }}
                  />
                  <rect
                    x={pos.x - 8}
                    y={auditY - 6}
                    width={16}
                    height={12}
                    rx={2}
                    fill="#0E0E14"
                    stroke={isActive ? stage.color : '#555566'}
                    strokeOpacity={isActive ? 1 : 0.4}
                    strokeWidth={1}
                    style={{
                      transition: 'stroke 300ms, stroke-opacity 300ms',
                      filter: isActive ? `drop-shadow(0 0 6px ${stage.color})` : 'none',
                    }}
                  />
                </g>
              );
            })}
            <text
              x={getNodePosition(0).x}
              y={auditY + 26}
              fill="#777788"
              fontSize="9"
              fontFamily="monospace"
            >
              hash-chained, tamper-evident audit
            </text>
          </g>
        )}

        {/* Stage nodes */}
        {stages.map((stage, i) => {
          const pos = getNodePosition(i);
          const isActive = activeStage === i;
          const isHovered = hoveredStage === i;

          return (
            <g
              key={stage.id}
              onMouseEnter={() => setHoveredStage(i)}
              onMouseLeave={() => setHoveredStage(-1)}
              style={{ cursor: 'pointer' }}
            >
              {isActive && (
                <rect
                  x={pos.x - halfNode}
                  y={pos.y - halfNode}
                  width={nodeSize}
                  height={nodeSize}
                  rx={12}
                  fill="none"
                  stroke={stage.color}
                  strokeWidth={1}
                  opacity={0.3}
                  style={{ filter: `drop-shadow(0 0 8px ${stage.color})` }}
                />
              )}

              <rect
                x={pos.x - halfNode}
                y={pos.y - halfNode}
                width={nodeSize}
                height={nodeSize}
                rx={12}
                fill="#0E0E14"
                stroke={isActive ? stage.color : '#555566'}
                strokeOpacity={isActive ? 1 : 0.4}
                strokeWidth={isActive ? 1.5 : 1}
                style={{
                  transition: 'stroke 300ms, stroke-opacity 300ms',
                  animation: isActive ? 'arfPulse 600ms ease-in-out' : 'none',
                }}
              />

              <foreignObject x={pos.x - 14} y={pos.y - 20} width={28} height={28}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StageIcon stageId={stage.id} color={stage.color} active={isActive || isHovered} />
                </div>
              </foreignObject>

              <text
                x={pos.x}
                y={pos.y + halfNode + 16}
                textAnchor="middle"
                fill={isActive ? stage.color : '#888899'}
                fontSize={isMobile ? 10 : 11}
                fontFamily="monospace"
                fontWeight="600"
                style={{ transition: 'fill 300ms', textShadow: '0 0 8px #06060A, 0 0 16px #06060A' }}
              >
                {stage.label}
              </text>

              <text
                x={pos.x}
                y={pos.y + halfNode + 30}
                textAnchor="middle"
                fill="#555566"
                fontSize={isMobile ? 8 : 9}
                fontFamily="monospace"
                style={{ textShadow: '0 0 8px #06060A, 0 0 16px #06060A' }}
              >
                {stage.sublabel}
              </text>
            </g>
          );
        })}
      </svg>

      {/* HTML Tooltip overlays */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none" style={{ maxHeight: '380px' }}>
          {stages.map((stage, i) => {
            const pos = getNodePosition(i);
            const leftPct = (pos.x / 1000) * 100;
            const topPct = ((pos.y - halfNode) / 380) * 100;

            return (
              <div
                key={stage.id}
                className="absolute pointer-events-auto"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: 'translateX(-50%)',
                  width: `${nodeSize}px`,
                  height: `${nodeSize}px`,
                }}
                onMouseEnter={() => setHoveredStage(i)}
                onMouseLeave={() => setHoveredStage(-1)}
              >
                <Tooltip stage={stage} visible={hoveredStage === i} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
