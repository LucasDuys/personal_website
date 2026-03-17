'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { forceX, forceY, forceCollide } from 'd3-force';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { CLIPrompt } from '@/components/ui/CLIPrompt';
import { skills, CLUSTER_COLORS, CLUSTER_LABELS } from '@/data/skills';
import { getRelevanceScores } from '@/data/skillQueries';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

const AUTO_QUERIES = ['AI', 'full-stack', 'backend', 'leadership', 'data pipeline'];

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface GraphNode {
  id: string;
  cluster: string;
  size: number;
  color: string;
  x?: number;
  y?: number;
  __index?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
}

export function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });
  const [cliDone, setCliDone] = useState(false);
  const [systemShown, setSystemShown] = useState(false);
  const [bigBangDone, setBigBangDone] = useState(false);
  const [graphReady, setGraphReady] = useState(false);

  // Container sizing
  const [containerWidth, setContainerWidth] = useState(800);
  const [isMobile, setIsMobile] = useState(false);

  // Search state
  const [searchValue, setSearchValue] = useState('');
  const [relevanceScores, setRelevanceScores] = useState<Record<string, number>>({});
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [interacted, setInteracted] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const autoRef = useRef<NodeJS.Timeout | null>(null);
  const autoTypingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Graph data
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = skills.map(s => ({
      id: s.name,
      cluster: s.cluster,
      size: s.size,
      color: CLUSTER_COLORS[s.cluster],
    }));

    const links: GraphLink[] = skills.flatMap(s =>
      s.connections
        .filter(conn => skills.some(sk => sk.name === conn))
        .map(conn => ({ source: s.name, target: conn }))
    ).filter((link, i, arr) =>
      i === arr.findIndex(l =>
        (l.source === link.source && l.target === link.target) ||
        (l.source === link.target && l.target === link.source)
      )
    );

    return { nodes, links };
  }, []);

  // Connected nodes for hover state
  const connectedNodes = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const connected = new Set<string>();
    connected.add(hoveredNode);
    graphData.links.forEach(link => {
      const src = typeof link.source === 'object' ? (link.source as GraphNode).id : link.source;
      const tgt = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;
      if (src === hoveredNode) connected.add(tgt);
      if (tgt === hoveredNode) connected.add(src);
    });
    return connected;
  }, [hoveredNode, graphData.links]);

  const hasSearch = Object.keys(relevanceScores).length > 0;
  const topMatch = hasSearch
    ? Object.entries(relevanceScores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
    : null;

  // Container resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    setContainerWidth(containerRef.current.clientWidth);
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [systemShown]);

  // CLI intro sequence
  const handleCliComplete = useCallback(() => {
    setCliDone(true);
    setTimeout(() => setSystemShown(true), 300);
  }, []);

  // Staged entrance
  useEffect(() => {
    if (!systemShown) return;
    const t1 = setTimeout(() => setGraphReady(true), 400);
    const t2 = setTimeout(() => setBigBangDone(true), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [systemShown]);

  // Cluster forces - apply after graph mounts
  useEffect(() => {
    if (!graphRef.current || !graphReady) return;

    const clusterPositions: Record<string, { x: number; y: number }> = {
      frontend: { x: -80, y: -70 },
      backend: { x: 80, y: -70 },
      ai: { x: -80, y: 70 },
      soft: { x: 80, y: 70 },
    };

    graphRef.current.d3Force('x',
      forceX<GraphNode>((node: GraphNode) => clusterPositions[node.cluster]?.x || 0).strength(0.5)
    );
    graphRef.current.d3Force('y',
      forceY<GraphNode>((node: GraphNode) => clusterPositions[node.cluster]?.y || 0).strength(0.5)
    );
    graphRef.current.d3Force('charge')?.strength(-40);
    graphRef.current.d3Force('collide', forceCollide(22));

    // Zoom to fit all nodes after simulation settles
    setTimeout(() => {
      if (graphRef.current) {
        graphRef.current.zoomToFit(800, 40);
      }
    }, 1500);
  }, [graphReady]);

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

  // Keep the graph animating for breathing effect
  useEffect(() => {
    if (!graphRef.current || !graphReady) return;
    let animFrame: number;
    const tick = () => {
      if (graphRef.current) {
        graphRef.current.refresh();
      }
      animFrame = requestAnimationFrame(tick);
    };
    // Refresh at ~30fps for breathing animation
    const interval = setInterval(() => {
      if (graphRef.current) graphRef.current.refresh();
    }, 33);
    return () => {
      cancelAnimationFrame(animFrame);
      clearInterval(interval);
    };
  }, [graphReady]);

  const graphHeight = isMobile ? 350 : 500;

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
              Loading skill vectors... <span className="text-[var(--text-primary)]">18 skills</span> mapped to 2D via t-SNE
            </motion.div>
          )}
        </AnimatePresence>

        {/* Force Graph Visualization */}
        {systemShown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <div
              ref={containerRef}
              className="relative w-full rounded-lg overflow-hidden border border-[var(--border)]"
              style={{
                height: graphHeight,
                background: `
                  radial-gradient(ellipse at 25% 40%, rgba(34,211,238,0.03), transparent 50%),
                  radial-gradient(ellipse at 75% 30%, rgba(139,92,246,0.03), transparent 50%),
                  radial-gradient(ellipse at 30% 70%, rgba(251,191,36,0.03), transparent 50%),
                  radial-gradient(ellipse at 75% 65%, rgba(74,222,128,0.03), transparent 50%)
                `,
              }}
            >
              {graphReady && containerWidth > 0 && (
                <ForceGraph2D
                  ref={graphRef}
                  graphData={graphData}
                  width={containerWidth}
                  height={graphHeight}
                  backgroundColor="transparent"
                  nodeId="id"

                  // Physics
                  cooldownTicks={100}
                  d3AlphaDecay={0.02}
                  d3VelocityDecay={0.3}

                  // Disable scroll-wheel zoom entirely (prevents hijacking page scroll)
                  // Users can still zoom via click-to-focus and double-click
                  enableZoomInteraction={false}
                  enablePanInteraction={false}

                  // Links
                  linkCurvature={0.2}
                  linkColor={() => 'rgba(46, 125, 255, 0.15)'}
                  linkWidth={1}
                  linkDirectionalParticles={3}
                  linkDirectionalParticleSpeed={0.004}
                  linkDirectionalParticleWidth={2}
                  linkDirectionalParticleColor={(link: any) => {
                    const sourceNode = skills.find(s => s.name === (typeof link.source === 'object' ? link.source.id : link.source));
                    return sourceNode ? CLUSTER_COLORS[sourceNode.cluster] : '#2E7DFF';
                  }}

                  // Nodes - custom canvas rendering
                  nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                    if (node.x == null || node.y == null) return;

                    const size = (node.size || 10) / globalScale;
                    const color = node.color || '#fff';
                    const isHovered = hoveredNode === node.id;
                    const isConnected = hoveredNode != null && connectedNodes.has(node.id as string);
                    const isDimmed = hoveredNode != null && !isConnected && hoveredNode !== node.id;

                    // Search-based dimming
                    const isSearchDimmed = hasSearch && (relevanceScores[node.id as string] ?? 0) < 0.3;
                    const searchAlpha = hasSearch
                      ? 0.15 + (relevanceScores[node.id as string] ?? 0) * 0.85
                      : 1;

                    const alpha = hasSearch ? searchAlpha : (isDimmed ? 0.15 : 1);
                    const searchScale = hasSearch
                      ? 0.6 + (relevanceScores[node.id as string] ?? 0) * 0.6
                      : 1;
                    const hoverScale = isHovered ? 1.4 : isConnected ? 1.1 : 1;
                    const scale = hasSearch ? searchScale : hoverScale;
                    const r = size * scale;

                    // Glow (outer halo)
                    const glowSize = r * 3;
                    try {
                      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
                      gradient.addColorStop(0, hexToRgba(color, 0.3 * alpha));
                      gradient.addColorStop(0.5, hexToRgba(color, 0.08 * alpha));
                      gradient.addColorStop(1, 'rgba(0,0,0,0)');
                      ctx.fillStyle = gradient;
                      ctx.fillRect(node.x - glowSize, node.y - glowSize, glowSize * 2, glowSize * 2);
                    } catch {
                      // fallback if gradient fails
                    }

                    // Breathing pulse
                    const pulse = 1 + 0.06 * Math.sin(Date.now() / 800 + (node.__index || 0));
                    const finalR = r * pulse;

                    // Main circle
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, finalR, 0, 2 * Math.PI);
                    ctx.fillStyle = hexToRgba(color, 0.7 * alpha);
                    ctx.fill();

                    // Inner bright core
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, finalR * 0.4, 0, 2 * Math.PI);
                    ctx.fillStyle = hexToRgba('#ffffff', 0.3 * alpha);
                    ctx.fill();

                    // Label
                    const fontSize = Math.max(10 / globalScale, 3);
                    ctx.font = `500 ${fontSize}px "Space Grotesk", sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    ctx.fillStyle = hexToRgba('#E8E6E3', 0.8 * alpha);
                    ctx.fillText(node.id as string, node.x, node.y + finalR + 4 / globalScale);
                  }}
                  nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
                    if (node.x == null || node.y == null) return;
                    const size = (node.size || 10) * 1.5;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
                    ctx.fillStyle = color;
                    ctx.fill();
                  }}

                  // Interactions
                  onNodeHover={(node: any) => {
                    setHoveredNode(node?.id || null);
                  }}
                  onNodeClick={(node: any) => {
                    if (graphRef.current) {
                      graphRef.current.centerAt(node.x, node.y, 800);
                      graphRef.current.zoom(3, 800);
                    }
                  }}
                  onBackgroundClick={() => {
                    if (graphRef.current) {
                      graphRef.current.centerAt(0, 0, 800);
                      graphRef.current.zoom(1, 800);
                    }
                  }}
                />
              )}
            </div>

            {/* Interaction hint */}
            {!hoveredNode && graphReady && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[var(--surface-1)]/80 backdrop-blur-sm border border-[var(--border)] rounded-full px-4 py-1.5 font-mono text-[10px] text-[var(--text-muted)] z-10 pointer-events-none">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" className="opacity-50">
                  <circle cx="7" cy="5" r="3" />
                  <path d="M4 10c0-1.5 1.3-3 3-3s3 1.5 3 3" />
                </svg>
                {isMobile ? 'tap nodes to explore' : 'hover & drag nodes to explore'}
              </div>
            )}

            {/* Tooltip (shown on hover/tap) */}
            {hoveredNode && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[var(--surface-1)] border border-[var(--border)] rounded px-3 py-1.5 font-mono text-xs text-[var(--text-primary)] z-10">
                <span
                  className="inline-block w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: CLUSTER_COLORS[skills.find(s => s.name === hoveredNode)?.cluster ?? 'frontend'] }}
                />
                {hoveredNode}
                <span className="text-[var(--text-muted)] ml-2">
                  {CLUSTER_LABELS[skills.find(s => s.name === hoveredNode)?.cluster ?? 'frontend']}
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
