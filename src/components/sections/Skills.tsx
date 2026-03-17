'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { CLIPrompt } from '@/components/ui/CLIPrompt';
import { skills, CLUSTER_COLORS, CLUSTER_LABELS } from '@/data/skills';
import { getRelevanceScores } from '@/data/skillQueries';

const VIEWBOX_W = 1000;
const VIEWBOX_H = 600;
const GRID_SPACING = 80;
const AUTO_QUERIES = ['AI', 'full-stack', 'frontend', 'backend', 'data pipeline'];

function scaleX(pct: number) { return (pct / 100) * VIEWBOX_W; }
function scaleY(pct: number) { return (pct / 100) * VIEWBOX_H; }

// Seeded pseudo-random for deterministic values
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// Build connection pairs (deduplicated)
function getConnectionPairs() {
  const seen = new Set<string>();
  const pairs: { from: string; to: string; fromCluster: string; x1: number; y1: number; x2: number; y2: number; id: string }[] = [];
  const skillMap = new Map(skills.map(s => [s.name, s]));

  for (const skill of skills) {
    for (const connName of skill.connections) {
      const key = [skill.name, connName].sort().join('|||');
      if (seen.has(key)) continue;
      seen.add(key);
      const target = skillMap.get(connName);
      if (!target) continue;
      const id = `edge-${skill.name}-${connName}`.replace(/[^a-zA-Z0-9-]/g, '_');
      pairs.push({
        from: skill.name,
        to: connName,
        fromCluster: skill.cluster,
        x1: scaleX(skill.x),
        y1: scaleY(skill.y),
        x2: scaleX(target.x),
        y2: scaleY(target.y),
        id,
      });
    }
  }
  return pairs;
}

const connectionPairs = getConnectionPairs();

// Pre-select ~35% of edges for pulse dots
const pulseEdgeIndices = connectionPairs
  .map((_, i) => i)
  .filter(i => seededRandom(i + 42) < 0.35);

// Compute cluster centers for nebulae
function getClusterCenters() {
  const clusters: Record<string, { sumX: number; sumY: number; count: number }> = {};
  for (const s of skills) {
    if (!clusters[s.cluster]) clusters[s.cluster] = { sumX: 0, sumY: 0, count: 0 };
    clusters[s.cluster].sumX += scaleX(s.x);
    clusters[s.cluster].sumY += scaleY(s.y);
    clusters[s.cluster].count++;
  }
  const centers: Record<string, { cx: number; cy: number }> = {};
  for (const [k, v] of Object.entries(clusters)) {
    centers[k] = { cx: v.sumX / v.count, cy: v.sumY / v.count };
  }
  return centers;
}

const clusterCenters = getClusterCenters();

// Compute bezier control point for a curved edge
function getBezierControlPoint(x1: number, y1: number, x2: number, y2: number, seed: number) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { cpX: midX, cpY: midY };
  // Randomize offset direction and magnitude slightly
  const direction = seededRandom(seed) > 0.5 ? 1 : -1;
  const offset = 18 + seededRandom(seed + 7) * 12;
  const cpX = midX - (dy / len) * offset * direction;
  const cpY = midY + (dx / len) * offset * direction;
  return { cpX, cpY };
}

function getEdgePath(pair: typeof connectionPairs[0], index: number) {
  const { cpX, cpY } = getBezierControlPoint(pair.x1, pair.y1, pair.x2, pair.y2, index);
  return `M ${pair.x1},${pair.y1} Q ${cpX},${cpY} ${pair.x2},${pair.y2}`;
}

// Estimate path length for stroke-dasharray animation
function estimatePathLength(pair: typeof connectionPairs[0], index: number) {
  const { cpX, cpY } = getBezierControlPoint(pair.x1, pair.y1, pair.x2, pair.y2, index);
  // Rough approximation: sum of distances through control point
  const d1 = Math.sqrt((cpX - pair.x1) ** 2 + (cpY - pair.y1) ** 2);
  const d2 = Math.sqrt((pair.x2 - cpX) ** 2 + (pair.y2 - cpY) ** 2);
  return d1 + d2;
}

export function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });
  const [cliDone, setCliDone] = useState(false);
  const [systemShown, setSystemShown] = useState(false);
  const [bigBangDone, setBigBangDone] = useState(false);
  const [entranceStage, setEntranceStage] = useState(0);
  // 0 = nothing, 1 = nebulae, 2 = nodes, 3 = edges, 4 = pulses+breathing

  // Search state
  const [searchValue, setSearchValue] = useState('');
  const [relevanceScores, setRelevanceScores] = useState<Record<string, number>>({});
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [interacted, setInteracted] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const autoRef = useRef<NodeJS.Timeout | null>(null);
  const autoTypingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // CLI intro sequence
  useEffect(() => {
    if (!isInView) return;
    // CLIPrompt handles typing; after it completes we show system response
  }, [isInView]);

  const handleCliComplete = useCallback(() => {
    setCliDone(true);
    setTimeout(() => setSystemShown(true), 300);
  }, []);

  // Staged entrance sequence
  useEffect(() => {
    if (!systemShown) return;
    // Stage 1: nebulae fade in (immediate)
    setEntranceStage(1);
    // Stage 2: nodes (0.5s)
    const t2 = setTimeout(() => setEntranceStage(2), 500);
    // Stage 3: edges (2s)
    const t3 = setTimeout(() => setEntranceStage(3), 2000);
    // Stage 4: pulses + breathing (3.5s)
    const t4 = setTimeout(() => setEntranceStage(4), 3500);
    // Big bang done (for search/legend)
    const t5 = setTimeout(() => setBigBangDone(true), 2500);
    return () => { clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [systemShown]);

  // Search debounce
  const handleSearchChange = useCallback((val: string) => {
    setSearchValue(val);
    if (!autoTypingRef.current) setInteracted(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const scores = val.trim() ? getRelevanceScores(val) : {};
      setRelevanceScores(scores);
    }, 200);
  }, []);

  // Auto-demo
  useEffect(() => {
    if (!bigBangDone) return;
    const startTimer = () => {
      autoRef.current = setTimeout(() => {
        if (interacted) return;
        runAutoDemo();
      }, 5000);
    };

    const runAutoDemo = () => {
      let queryIdx = 0;

      const cycleQuery = () => {
        if (interacted) return;
        const query = AUTO_QUERIES[queryIdx % AUTO_QUERIES.length];
        autoTypingRef.current = true;

        let charIdx = 0;
        const typeIn = () => {
          if (interacted) { autoTypingRef.current = false; return; }
          charIdx++;
          const current = query.slice(0, charIdx);
          setSearchValue(current);
          if (charIdx <= query.length) {
            const scores = getRelevanceScores(current);
            setRelevanceScores(scores);
          }
          if (charIdx < query.length) {
            autoRef.current = setTimeout(typeIn, 50);
          } else {
            autoRef.current = setTimeout(eraseOut, 3500);
          }
        };

        const eraseOut = () => {
          if (interacted) { autoTypingRef.current = false; return; }
          let eraseIdx = query.length;
          const erase = () => {
            if (interacted) { autoTypingRef.current = false; return; }
            eraseIdx--;
            const cur = query.slice(0, eraseIdx);
            setSearchValue(cur);
            if (eraseIdx <= 0) {
              setRelevanceScores({});
              autoTypingRef.current = false;
              queryIdx++;
              autoRef.current = setTimeout(cycleQuery, 800);
            } else {
              autoRef.current = setTimeout(erase, 30);
            }
          };
          erase();
        };

        typeIn();
      };

      cycleQuery();
    };

    startTimer();
    return () => {
      if (autoRef.current) clearTimeout(autoRef.current);
    };
  }, [bigBangDone, interacted]);

  // Stop auto-demo on interaction
  useEffect(() => {
    if (interacted && autoRef.current) {
      clearTimeout(autoRef.current);
      autoTypingRef.current = false;
    }
  }, [interacted]);

  // Hovered skill connections
  const hoveredConnections = useMemo(() => {
    if (!hoveredSkill) return new Set<string>();
    const skill = skills.find(s => s.name === hoveredSkill);
    if (!skill) return new Set<string>();
    const connected = new Set(skill.connections);
    connected.add(hoveredSkill);
    for (const s of skills) {
      if (s.connections.includes(hoveredSkill)) {
        connected.add(s.name);
      }
    }
    return connected;
  }, [hoveredSkill]);

  const hasSearch = Object.keys(relevanceScores).length > 0;
  const topMatch = hasSearch
    ? Object.entries(relevanceScores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
    : null;

  // Grid lines for background
  const gridLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let x = GRID_SPACING; x < VIEWBOX_W; x += GRID_SPACING) {
      lines.push({ x1: x, y1: 0, x2: x, y2: VIEWBOX_H });
    }
    for (let y = GRID_SPACING; y < VIEWBOX_H; y += GRID_SPACING) {
      lines.push({ x1: 0, y1: y, x2: VIEWBOX_W, y2: y });
    }
    return lines;
  }, []);

  // Per-dot random stagger for entrance
  const staggerDelays = useMemo(
    () => skills.map((_, i) => seededRandom(i + 100) * 150),
    []
  );

  // Per-node breathing delays
  const breatheDelays = useMemo(
    () => skills.map((_, i) => seededRandom(i + 200) * 4),
    []
  );

  // Pulse dot begin times
  const pulseBeginTimes = useMemo(
    () => pulseEdgeIndices.map((_, i) => (seededRandom(i + 300) * 5).toFixed(1)),
    []
  );

  function getDotOpacity(skillName: string) {
    if (hasSearch) {
      const score = relevanceScores[skillName] ?? 0;
      return 0.15 + score * 0.85;
    }
    if (hoveredSkill) {
      return hoveredConnections.has(skillName) ? 1 : 0.2;
    }
    return 1;
  }

  function getDotScale(skillName: string) {
    if (hasSearch) {
      const score = relevanceScores[skillName] ?? 0;
      return 0.6 + score * 0.6;
    }
    if (hoveredSkill === skillName) return 1.3;
    return 1;
  }

  // Cluster order for staggered node entrance
  const clusterOrder = ['frontend', 'backend', 'ai'];

  function getClusterDelay(cluster: string) {
    const idx = clusterOrder.indexOf(cluster);
    return 0.5 + idx * 0.35; // 0.5s, 0.85s, 1.2s, 1.55s
  }

  return (
    <SectionWrapper config={{ id: 'skills', index: '004', label: 'skills' }}>
      <div ref={sectionRef} className="space-y-6">
        {/* CSS for breathing and edge draw-in animations */}
        <style>{`
          @keyframes breathe {
            0%, 100% { opacity: 0.7; r: var(--base-r); }
            50% { opacity: 1; r: calc(var(--base-r) * 1.08); }
          }
          @keyframes breathe-halo {
            0%, 100% { opacity: 0.08; }
            50% { opacity: 0.15; }
          }
          @keyframes breathe-core {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 0.95; }
          }
          .edge-path {
            stroke-dasharray: var(--path-len);
            stroke-dashoffset: var(--path-len);
            animation: drawEdge 1.5s ease-out forwards;
            animation-delay: var(--edge-delay);
          }
          @keyframes drawEdge {
            to { stroke-dashoffset: 0; }
          }
          .node-breathe {
            animation: nodeBreathePulse 3.5s ease-in-out infinite;
            animation-delay: var(--breathe-delay);
          }
          @keyframes nodeBreathePulse {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.06); opacity: 1; }
          }
        `}</style>

        {/* CLI Intro */}
        {isInView && (
          <CLIPrompt
            command="query skills --visualize --method embedding_space"
            onComplete={handleCliComplete}
          />
        )}

        {/* System response */}
        <AnimatePresence>
          {cliDone && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-sm text-[var(--text-secondary)]"
            >
              <span className="text-[var(--accent-green)]">{'\u2192'}</span>{' '}
              Loading skill vectors... <span className="text-[var(--text-primary)]">15 skills</span> mapped to 2D via t-SNE
            </motion.div>
          )}
        </AnimatePresence>

        {/* Neural Network Visualization */}
        {systemShown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <svg
              viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
              className="w-full h-auto"
              style={{ maxHeight: '65vh' }}
            >
              <defs>
                {/* Per-cluster glow filters */}
                {Object.entries(CLUSTER_COLORS).map(([cluster, color]) => (
                  <filter key={cluster} id={`glow-${cluster}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feFlood floodColor={color} floodOpacity="0.6" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="colorBlur" />
                    <feMerge>
                      <feMergeNode in="colorBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                ))}

                {/* Hover glow filter */}
                <filter id="glow-hover" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                  <feFlood floodColor="#fff" floodOpacity="0.4" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="colorBlur" />
                  <feMerge>
                    <feMergeNode in="colorBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Pulse dot glow - tighter, brighter */}
                <filter id="glow-pulse" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Cluster nebula gradients */}
                {Object.entries(CLUSTER_COLORS).map(([cluster, color]) => (
                  <radialGradient key={`nebula-${cluster}`} id={`nebula-${cluster}`}>
                    <stop offset="0%" stopColor={color} stopOpacity="0.05" />
                    <stop offset="70%" stopColor={color} stopOpacity="0.02" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                  </radialGradient>
                ))}
              </defs>

              {/* Grid */}
              {gridLines.map((line, i) => (
                <line
                  key={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="var(--text-muted)"
                  strokeOpacity={0.06}
                  strokeWidth={0.5}
                />
              ))}

              {/* Stage 1: Cluster nebulae */}
              {entranceStage >= 1 && Object.entries(clusterCenters).map(([cluster, center]) => (
                <motion.circle
                  key={`nebula-${cluster}`}
                  cx={center.cx}
                  cy={center.cy}
                  r={150}
                  fill={`url(#nebula-${cluster})`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                />
              ))}

              {/* Stage 3: Curved edge paths */}
              {entranceStage >= 3 && connectionPairs.map((pair, i) => {
                const pathD = getEdgePath(pair, i);
                const pathLen = estimatePathLength(pair, i);
                const lineActive = hoveredSkill
                  ? hoveredConnections.has(pair.from) && hoveredConnections.has(pair.to)
                  : false;
                const edgeColor = lineActive
                  ? CLUSTER_COLORS[skills.find(s => s.name === pair.from)?.cluster ?? 'frontend']
                  : 'var(--text-muted)';
                const edgeOpacity = hoveredSkill
                  ? (lineActive ? 0.5 : 0.03)
                  : (hasSearch ? 0.06 : undefined);

                return (
                  <path
                    key={`edge-${i}`}
                    id={pair.id}
                    d={pathD}
                    fill="none"
                    stroke={edgeColor}
                    strokeOpacity={edgeOpacity ?? 0.1}
                    strokeWidth={lineActive ? 2 : 0.8}
                    className={!hoveredSkill && !hasSearch ? 'edge-path' : ''}
                    style={
                      !hoveredSkill && !hasSearch
                        ? {
                            ['--path-len' as string]: pathLen,
                            ['--edge-delay' as string]: `${(i * 0.04).toFixed(2)}s`,
                          }
                        : { transition: 'stroke-opacity 0.3s, stroke-width 0.3s, stroke 0.3s' }
                    }
                  />
                );
              })}

              {/* Stage 4: Pulse dots along edges */}
              {entranceStage >= 4 && pulseEdgeIndices.map((edgeIdx, pi) => {
                const pair = connectionPairs[edgeIdx];
                const color = CLUSTER_COLORS[pair.fromCluster] ?? '#22D3EE';
                const lineActive = hoveredSkill
                  ? hoveredConnections.has(pair.from) && hoveredConnections.has(pair.to)
                  : false;
                const dur = lineActive ? '1.5s' : `${(2.5 + seededRandom(edgeIdx + 500) * 2).toFixed(1)}s`;

                // Hide pulse dots on unconnected edges when hovering
                if (hoveredSkill && !lineActive) return null;

                return (
                  <circle
                    key={`pulse-${pi}`}
                    r={1.8}
                    fill={color}
                    opacity={0.85}
                    filter="url(#glow-pulse)"
                  >
                    <animateMotion
                      dur={dur}
                      repeatCount="indefinite"
                      begin={`${pulseBeginTimes[pi]}s`}
                    >
                      <mpath href={`#${pair.id}`} />
                    </animateMotion>
                  </circle>
                );
              })}

              {/* Stage 2: Skill nodes */}
              {entranceStage >= 2 && skills.map((skill, i) => {
                const cx = scaleX(skill.x);
                const cy = scaleY(skill.y);
                const color = CLUSTER_COLORS[skill.cluster];
                const dotOpacity = getDotOpacity(skill.name);
                const dotScale = getDotScale(skill.name);
                const isHovered = hoveredSkill === skill.name;
                const clusterDelay = getClusterDelay(skill.cluster);
                const nodeDelay = clusterDelay + staggerDelays[i] / 1000;

                return (
                  <motion.g
                    key={skill.name}
                    initial={{
                      x: 0,
                      y: 15,
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: 0,
                      y: 0,
                      scale: dotScale,
                      opacity: dotOpacity,
                    }}
                    transition={{
                      y: { type: 'spring', stiffness: 80, damping: 15, delay: nodeDelay },
                      scale: {
                        type: 'spring',
                        stiffness: 80,
                        damping: 15,
                        delay: nodeDelay,
                      },
                      opacity: { duration: 0.4, delay: nodeDelay },
                    }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    onClick={() => {
                      setInteracted(true);
                      setHoveredSkill(prev => prev === skill.name ? null : skill.name);
                    }}
                    className="cursor-pointer"
                  >
                    {/* Outer halo */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={skill.size * 2.2}
                      fill={color}
                      fillOpacity={0.08}
                      style={
                        entranceStage >= 4
                          ? {
                              animation: `breathe-halo 3.5s ease-in-out infinite`,
                              animationDelay: `${breatheDelays[i]}s`,
                            }
                          : undefined
                      }
                    />

                    {/* Main circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={skill.size}
                      fill={color}
                      fillOpacity={0.7}
                      stroke={color}
                      strokeWidth={1.5}
                      filter={isHovered ? 'url(#glow-hover)' : `url(#glow-${skill.cluster})`}
                      style={
                        entranceStage >= 4
                          ? {
                              animation: `nodeBreathePulse 3.5s ease-in-out infinite`,
                              animationDelay: `${breatheDelays[i]}s`,
                              transformOrigin: `${cx}px ${cy}px`,
                            }
                          : undefined
                      }
                    />

                    {/* Inner core */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={skill.size * 0.4}
                      fill="white"
                      fillOpacity={0.25}
                      style={
                        entranceStage >= 4
                          ? {
                              animation: `breathe-core 3.5s ease-in-out infinite`,
                              animationDelay: `${breatheDelays[i]}s`,
                            }
                          : undefined
                      }
                    />

                    {/* Label */}
                    <motion.text
                      x={cx}
                      y={cy + skill.size + 14}
                      textAnchor="middle"
                      fill="var(--text-secondary)"
                      fontSize={11}
                      fontFamily="var(--font-mono, monospace)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: dotOpacity }}
                      transition={{ duration: 0.3, delay: nodeDelay + 0.2 }}
                      className="skill-label pointer-events-none select-none"
                    >
                      {skill.name}
                    </motion.text>
                  </motion.g>
                );
              })}
            </svg>

            {/* Tooltip for mobile (shown on tap) */}
            {hoveredSkill && (
              <div className="md:hidden absolute top-2 left-1/2 -translate-x-1/2 bg-[var(--surface-1)] border border-[var(--border)] rounded px-3 py-1.5 font-mono text-xs text-[var(--text-primary)] z-10">
                <span
                  className="inline-block w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: CLUSTER_COLORS[skills.find(s => s.name === hoveredSkill)?.cluster ?? 'frontend'] }}
                />
                {hoveredSkill}
                <span className="text-[var(--text-muted)] ml-2">
                  {CLUSTER_LABELS[skills.find(s => s.name === hoveredSkill)?.cluster ?? 'frontend']}
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Search input */}
        {bigBangDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 font-mono text-sm bg-[var(--surface-1)] border border-[var(--border)] rounded px-3 sm:px-4 py-2.5">
              <span className="text-[var(--accent-green)] shrink-0 hidden sm:inline">
                <span className="text-[var(--accent-green)]">visitor</span>
                <span className="text-[var(--text-muted)]">@</span>
                <span className="text-[var(--accent-cyan)]">lucas.dev</span>
                <span className="text-[var(--text-muted)]">:~$ </span>
              </span>
              <span className="text-[var(--text-muted)] shrink-0"><span className="hidden sm:inline">query skills --similarity </span>&quot;</span>
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={e => handleSearchChange(e.target.value)}
                onFocus={() => setInteracted(true)}
                placeholder="type a query..."
                className="flex-1 min-w-0 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none font-mono text-sm"
                spellCheck={false}
                autoComplete="off"
              />
              <span className="text-[var(--text-muted)] shrink-0">&quot;</span>
            </div>

            {/* Results line */}
            {hasSearch && topMatch && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-xs text-[var(--text-secondary)] pl-4"
              >
                <span className="text-[var(--accent-green)]">{'\u2192'}</span>{' '}
                closest match: <span className="text-[var(--text-primary)]">{topMatch}</span>{' '}
                <span className="text-[var(--text-muted)]">
                  (similarity: {(relevanceScores[topMatch] ?? 0).toFixed(2)})
                </span>{' '}
                <span className="text-[var(--text-muted)]">
                  | {Object.keys(relevanceScores).length} skills relevant
                </span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Cluster Legend */}
        {bigBangDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-[var(--text-secondary)]"
          >
            {Object.entries(CLUSTER_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: CLUSTER_COLORS[key], opacity: 0.8 }}
                />
                {label}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </SectionWrapper>
  );
}
