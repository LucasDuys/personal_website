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
const AUTO_QUERIES = ['AI', 'full-stack', 'data pipeline', 'leadership'];

function scaleX(pct: number) { return (pct / 100) * VIEWBOX_W; }
function scaleY(pct: number) { return (pct / 100) * VIEWBOX_H; }

// Build connection pairs (deduplicated)
function getConnectionPairs() {
  const seen = new Set<string>();
  const pairs: { from: string; to: string; x1: number; y1: number; x2: number; y2: number }[] = [];
  const skillMap = new Map(skills.map(s => [s.name, s]));

  for (const skill of skills) {
    for (const connName of skill.connections) {
      const key = [skill.name, connName].sort().join('|||');
      if (seen.has(key)) continue;
      seen.add(key);
      const target = skillMap.get(connName);
      if (!target) continue;
      pairs.push({
        from: skill.name,
        to: connName,
        x1: scaleX(skill.x),
        y1: scaleY(skill.y),
        x2: scaleX(target.x),
        y2: scaleY(target.y),
      });
    }
  }
  return pairs;
}

const connectionPairs = getConnectionPairs();

export function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });
  const [cliDone, setCliDone] = useState(false);
  const [systemShown, setSystemShown] = useState(false);
  const [bigBangDone, setBigBangDone] = useState(false);

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

  // Big bang done after animation
  useEffect(() => {
    if (!systemShown) return;
    const t = setTimeout(() => setBigBangDone(true), 1000);
    return () => clearTimeout(t);
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
    // Start 5s timer
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

        // Type in
        let charIdx = 0;
        const typeIn = () => {
          if (interacted) { autoTypingRef.current = false; return; }
          charIdx++;
          const current = query.slice(0, charIdx);
          setSearchValue(current);
          if (charIdx <= query.length) {
            // Update relevance on each char for live feel
            const scores = getRelevanceScores(current);
            setRelevanceScores(scores);
          }
          if (charIdx < query.length) {
            autoRef.current = setTimeout(typeIn, 50);
          } else {
            // Hold
            autoRef.current = setTimeout(eraseOut, 3500);
          }
        };

        const eraseOut = () => {
          if (interacted) { autoTypingRef.current = false; return; }
          const current = searchValue; // captured via closure won't work, use query
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
    // Also add skills that connect TO this skill
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

  // Per-dot random stagger for big bang
  const staggerDelays = useMemo(
    () => skills.map(() => Math.random() * 150),
    []
  );

  function getDotOpacity(skillName: string) {
    if (hasSearch) {
      const score = relevanceScores[skillName] ?? 0;
      return 0.15 + score * 0.85;
    }
    if (hoveredSkill) {
      return hoveredConnections.has(skillName) ? 1 : 0.25;
    }
    return 1;
  }

  function getDotScale(skillName: string) {
    if (hasSearch) {
      const score = relevanceScores[skillName] ?? 0;
      return 0.6 + score * 0.6;
    }
    if (hoveredSkill === skillName) return 1.4;
    return 1;
  }

  return (
    <SectionWrapper config={{ id: 'skills', index: '004', label: 'skills' }}>
      <div ref={sectionRef} className="space-y-6">
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
              Loading skill vectors... <span className="text-[var(--text-primary)]">23 skills</span> mapped to 2D via t-SNE
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scatter Plot */}
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
              {/* Glow filter */}
              <defs>
                {Object.entries(CLUSTER_COLORS).map(([cluster, color]) => (
                  <filter key={cluster} id={`glow-${cluster}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feFlood floodColor={color} floodOpacity="0.6" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="colorBlur" />
                    <feMerge>
                      <feMergeNode in="colorBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                ))}
                <filter id="glow-hover" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                  <feFlood floodColor="#fff" floodOpacity="0.4" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="colorBlur" />
                  <feMerge>
                    <feMergeNode in="colorBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
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

              {/* Connection lines */}
              {connectionPairs.map((pair, i) => {
                const lineActive = hoveredSkill
                  ? hoveredConnections.has(pair.from) && hoveredConnections.has(pair.to)
                  : false;

                return (
                  <motion.line
                    key={`conn-${i}`}
                    x1={pair.x1}
                    y1={pair.y1}
                    x2={pair.x2}
                    y2={pair.y2}
                    stroke={
                      lineActive
                        ? CLUSTER_COLORS[skills.find(s => s.name === pair.from)?.cluster ?? 'frontend']
                        : 'var(--text-muted)'
                    }
                    strokeOpacity={lineActive ? 0.5 : 0.08}
                    strokeWidth={lineActive ? 1.5 : 0.8}
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 + i * 0.02 }}
                  />
                );
              })}

              {/* Skill dots */}
              {skills.map((skill, i) => {
                const cx = scaleX(skill.x);
                const cy = scaleY(skill.y);
                const color = CLUSTER_COLORS[skill.cluster];
                const dotOpacity = getDotOpacity(skill.name);
                const dotScale = getDotScale(skill.name);
                const isHovered = hoveredSkill === skill.name;

                return (
                  <motion.g
                    key={skill.name}
                    initial={{
                      x: scaleX(50) - cx,
                      y: scaleY(50) - cy,
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
                      x: { type: 'spring', stiffness: 80, damping: 15, delay: staggerDelays[i] / 1000 },
                      y: { type: 'spring', stiffness: 80, damping: 15, delay: staggerDelays[i] / 1000 },
                      scale: {
                        type: 'spring',
                        stiffness: 80,
                        damping: 15,
                        delay: staggerDelays[i] / 1000,
                      },
                      opacity: { duration: 0.3, delay: staggerDelays[i] / 1000 },
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
                    {/* Circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={skill.size}
                      fill={color}
                      fillOpacity={0.7}
                      stroke={color}
                      strokeWidth={1.5}
                      filter={isHovered ? 'url(#glow-hover)' : `url(#glow-${skill.cluster})`}
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
                      transition={{ duration: 0.3, delay: 0.9 + staggerDelays[i] / 1000 }}
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
