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
    id: 'ingest',
    label: 'INGEST',
    sublabel: 'Google Drive OAuth',
    color: '#4ADE80',
    tooltip: 'Google Drive OAuth / Supports PDF, DOCX, TXT / 847 documents processed',
  },
  {
    id: 'chunk',
    label: 'CHUNK',
    sublabel: 'Semantic + Overlap',
    color: '#FBBF24',
    tooltip: 'Dual strategy: semantic + overlap / Chunk size: 512 tokens / Overlap: 50 tokens',
  },
  {
    id: 'embed',
    label: 'EMBED',
    sublabel: 'OpenRouter Batched',
    color: '#8B5CF6',
    tooltip: 'OpenRouter batched / text-embedding-3-small / Retries + backoff / 1536 dimensions',
  },
  {
    id: 'retrieve',
    label: 'RETRIEVE',
    sublabel: 'Vector + BM25',
    color: '#2E7DFF',
    tooltip: 'Hybrid search / pgvector RPC + BM25 / Top-K: 20 each / 40 candidates',
  },
  {
    id: 'fuse',
    label: 'FUSE',
    sublabel: 'Reciprocal Rank Fusion',
    color: '#22D3EE',
    tooltip: 'Weighted RRF / k=60 / w_vector=0.6, w_bm25=0.4 / Output: top 5 chunks',
  },
  {
    id: 'generate',
    label: 'GENERATE',
    sublabel: 'LLM + Sources',
    color: '#E8E6E3',
    tooltip: 'LLM answer generation / Source citations / Streaming via OpenRouter / ~2.3s avg',
  },
];

/* ---------- Icons (simple SVG shapes) ---------- */

function StageIcon({ stageId, color, active }: { stageId: string; color: string; active: boolean }) {
  const fill = active ? color : '#777788';
  const stroke = active ? color : '#777788';

  switch (stageId) {
    case 'ingest':
      // Document icon
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M8 3h8l6 6v16H8V3z" stroke={stroke} strokeWidth="1.5" fill="none" />
          <path d="M16 3v6h6" stroke={stroke} strokeWidth="1.5" fill="none" />
          <line x1="11" y1="14" x2="20" y2="14" stroke={fill} strokeWidth="1.2" />
          <line x1="11" y1="18" x2="18" y2="18" stroke={fill} strokeWidth="1.2" />
        </svg>
      );
    case 'chunk':
      // Grid / blocks icon
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="4" width="9" height="9" rx="1.5" stroke={stroke} strokeWidth="1.5" />
          <rect x="15" y="4" width="9" height="9" rx="1.5" stroke={stroke} strokeWidth="1.5" />
          <rect x="4" y="15" width="9" height="9" rx="1.5" stroke={stroke} strokeWidth="1.5" />
          <rect x="15" y="15" width="9" height="9" rx="1.5" stroke={fill} strokeWidth="1.5" fill={active ? `${color}22` : 'none'} />
        </svg>
      );
    case 'embed':
      // Vector/dimension icon
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="9" stroke={stroke} strokeWidth="1.5" />
          <circle cx="14" cy="14" r="3" fill={fill} />
          <line x1="14" y1="5" x2="14" y2="11" stroke={stroke} strokeWidth="1.2" />
          <line x1="14" y1="17" x2="14" y2="23" stroke={stroke} strokeWidth="1.2" />
          <line x1="5" y1="14" x2="11" y2="14" stroke={stroke} strokeWidth="1.2" />
          <line x1="17" y1="14" x2="23" y2="14" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case 'retrieve':
      // Search/magnifier icon
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="12" cy="12" r="7" stroke={stroke} strokeWidth="1.5" />
          <line x1="17" y1="17" x2="24" y2="24" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2" fill={fill} />
        </svg>
      );
    case 'fuse':
      // Merge arrows icon
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M6 8 L14 14 L6 20" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 8 L14 14 L22 20" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="14" cy="14" r="2.5" fill={fill} />
        </svg>
      );
    case 'generate':
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

export function RAGPipeline() {
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
      // Horizontal layout: 6 nodes evenly spaced in 1000px width
      const padding = 80;
      const spacing = (1000 - padding * 2) / 5;
      return { x: padding + index * spacing, y: 175 };
    },
    [isMobile]
  );

  const nodeSize = 80;
  const halfNode = nodeSize / 2;

  // SVG viewBox
  const viewBox = isMobile ? '0 0 200 580' : '0 0 1000 350';

  // Build connection paths
  const getConnectionPath = useCallback(
    (fromIdx: number, toIdx: number, variant?: 'upper' | 'lower'): string => {
      const from = getNodePosition(fromIdx);
      const to = getNodePosition(toIdx);

      if (isMobile) {
        // Vertical connections
        const startY = from.y + halfNode;
        const endY = to.y - halfNode;
        const midY = (startY + endY) / 2;
        return `M ${from.x} ${startY} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${endY}`;
      }

      // Horizontal connections
      const startX = from.x + halfNode;
      const endX = to.x - halfNode;

      // Special: Embed -> Retrieve fork
      if (fromIdx === 2 && toIdx === 3 && variant) {
        const midX = (startX + endX) / 2;
        const offset = variant === 'upper' ? -20 : 20;
        return `M ${startX} ${from.y} C ${midX} ${from.y + offset}, ${midX} ${to.y + offset}, ${endX} ${to.y}`;
      }

      // Regular curved connection
      const midX = (startX + endX) / 2;
      return `M ${startX} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${endX} ${to.y}`;
    },
    [getNodePosition, isMobile, halfNode]
  );

  // Connection segments
  const connections = isMobile
    ? [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 4, to: 5 },
      ]
    : [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        // Embed -> Retrieve has two paths
        { from: 2, to: 3, variant: 'upper' as const },
        { from: 2, to: 3, variant: 'lower' as const },
        { from: 3, to: 4 },
        { from: 4, to: 5 },
      ];

  // Determine if a connection is "active" based on current flowing stage
  const isConnectionActive = (fromIdx: number): boolean => {
    return activeStage === fromIdx;
  };

  return (
    <div ref={containerRef} className="w-full max-w-[1000px] mx-auto relative">
      {/* CSS Animations */}
      <style>{`
        @keyframes dashFlow {
          to { stroke-dashoffset: -40; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes dotGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      <svg
        viewBox={viewBox}
        className="w-full h-auto"
        style={{ maxHeight: isMobile ? '580px' : '350px' }}
      >
        {/* Connection lines */}
        {connections.map((conn, i) => {
          const path = getConnectionPath(conn.from, conn.to, conn.variant);
          const active = isConnectionActive(conn.from);
          const fromColor = stages[conn.from].color;

          return (
            <g key={`conn-${i}`}>
              {/* Background dashed line */}
              <path
                d={path}
                fill="none"
                stroke="#555566"
                strokeOpacity={0.2}
                strokeWidth={1.5}
                strokeDasharray="6 4"
              />
              {/* Active solid line */}
              <path
                d={path}
                fill="none"
                stroke={fromColor}
                strokeWidth={2}
                strokeDasharray="8 4"
                style={{
                  opacity: active ? 0.8 : 0,
                  transition: 'opacity 300ms',
                  animation: active ? 'dashFlow 0.8s linear infinite' : 'none',
                }}
              />
              {/* Fork labels for Embed -> Retrieve */}
              {!isMobile && conn.from === 2 && conn.to === 3 && conn.variant && (
                <text
                  x={(getNodePosition(2).x + halfNode + getNodePosition(3).x - halfNode) / 2}
                  y={conn.variant === 'upper' ? 148 : 206}
                  textAnchor="middle"
                  fill="#777788"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {conn.variant === 'upper' ? 'vector' : 'BM25'}
                </text>
              )}
              {/* Traveling dot */}
              {active && (
                <circle r="5" fill={fromColor} opacity={0.9}>
                  <animateMotion dur="1.6s" repeatCount="1" fill="freeze">
                    <mpath href={`#motionPath-${i}`} />
                  </animateMotion>
                  <animate attributeName="opacity" values="0.9;1;0.9" dur="0.5s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Hidden path for animateMotion */}
              <path id={`motionPath-${i}`} d={path} fill="none" stroke="none" />
            </g>
          );
        })}

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
              {/* Glow effect */}
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

              {/* Node background */}
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
                  animation: isActive ? 'pulse 600ms ease-in-out' : 'none',
                }}
              />

              {/* Icon (positioned via foreignObject) */}
              <foreignObject
                x={pos.x - 14}
                y={pos.y - 20}
                width={28}
                height={28}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StageIcon stageId={stage.id} color={stage.color} active={isActive || isHovered} />
                </div>
              </foreignObject>

              {/* Label */}
              <text
                x={pos.x}
                y={pos.y + halfNode + 16}
                textAnchor="middle"
                fill={isActive ? stage.color : '#888899'}
                fontSize={isMobile ? 10 : 11}
                fontFamily="monospace"
                fontWeight="600"
                style={{ transition: 'fill 300ms' }}
              >
                {stage.label}
              </text>

              {/* Sublabel */}
              <text
                x={pos.x}
                y={pos.y + halfNode + 28}
                textAnchor="middle"
                fill="#555566"
                fontSize={isMobile ? 8 : 9}
                fontFamily="monospace"
              >
                {stage.sublabel}
              </text>
            </g>
          );
        })}
      </svg>

      {/* HTML Tooltip overlays */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none" style={{ maxHeight: '350px' }}>
          {stages.map((stage, i) => {
            const pos = getNodePosition(i);
            // Convert SVG coords to percentage positions
            const leftPct = (pos.x / 1000) * 100;
            const topPct = ((pos.y - halfNode) / 350) * 100;

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
