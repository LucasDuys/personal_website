/**
 * The front-page film.
 *
 * One WebGL points program morphing a field of stage dust through three
 * figures as the visitor scrolls: the spotlight ring, the rising trajectory,
 * and the LD mark. The grammar is ported from the Kenward front page and the
 * Stacklink run scene: scroll owns the timeline, the DOM owns every word, the
 * canvas owns light and dust and nothing that has to be read.
 *
 * Two properties carried over on purpose because they are the argument:
 *
 * - At rest the film neither plays nor freezes. Each dust point drifts toward
 *   the light on its own phase and fades before it arrives, so the field is
 *   always gathering and never arrives. A frozen field is a screenshot; a
 *   looping video is a video. This is neither.
 * - Every frame is drawn on demand. There is no idle clock once the visitor
 *   stops: scrolling schedules frames, settling velocity schedules frames,
 *   the rest of the time the canvas costs nothing.
 *
 * Perf budget (measured discipline from the Kenward pass): pixel ratio capped
 * at 1.25, no preserveDrawingBuffer, alpha:false, idle drawn at ~24fps and
 * only while the canvas is on screen.
 */

export type FilmTokens = {
  point: [number, number, number];
  accent: [number, number, number];
  background: [number, number, number];
};

const hex = (value: string): [number, number, number] => {
  const m = value.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return [0.9, 0.93, 0.96];
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export function readFilmTokens(): FilmTokens {
  const styles = getComputedStyle(document.documentElement);
  return {
    point: hex(styles.getPropertyValue('--ink')),
    accent: hex(styles.getPropertyValue('--signal')),
    background: hex(styles.getPropertyValue('--ground')),
  };
}

const VERT = `
attribute vec3 aDust; attribute vec3 aRing; attribute vec3 aArc; attribute vec3 aMark;
attribute float aSeed; attribute float aAccent;
uniform float uProgress; uniform float uTime; uniform float uVelocity;
uniform float uSize; uniform float uOpacity; uniform float uAspect; uniform float uFit;
uniform float uCalm;
varying float vFade; varying float vAccent;

float ease(float t) { return t * t * (3.0 - 2.0 * t); }

void main() {
  /* Each figure finishes forming BEFORE its caption arrives; the caption
     beats then drain the field away so the words stand alone. */
  float d = (fract(aSeed * 71.3) - 0.5) * 0.06;
  float wRing = smoothstep(0.12 + d, 0.26 + d, uProgress);
  float wArc  = smoothstep(0.36 + d, 0.50 + d, uProgress);
  float wMark = smoothstep(0.60 + d, 0.74 + d, uProgress);

  /* At rest each point sets off toward the ring on its own phase and fades
     before it lands, so the respawn is invisible and the field never settles. */
  float idle = 1.0 - smoothstep(0.0, 0.12, uProgress);
  float fall = fract(uTime * (0.05 + 0.06 * fract(aSeed * 7.7)) + aSeed);
  vec3 dust = mix(aDust, aRing, ease(fall) * 0.42 * idle);
  dust.x += sin(aSeed * 6.28318 + uTime * 0.4) * 0.03 * idle;
  dust.y += cos(aSeed * 9.4 + uTime * 0.31) * 0.025 * idle;
  float idleAlpha = mix(1.0, 0.25 + 0.75 * sin(3.14159 * fall), idle);

  vec3 p = mix(dust, aRing, wRing);
  p = mix(p, aArc, wArc);
  p = mix(p, aMark, wMark);
  /* While a caption holds the stage the field pours gently downward, so the
     dissolve itself walks the eye down onto the words. */
  p.y -= uCalm * (0.08 + 0.14 * fract(aSeed * 13.0));

  /* The dolly. The camera pushes in over the whole journey and the velocity
     of the scroll stretches the field along y, so a flick reads as travel. */
  float persp = 1.0 / (1.0 - p.z * 0.32);
  float scale = (1.0 + 0.20 * ease(uProgress)) * uFit;
  p.y += uVelocity * (0.04 + 0.16 * fract(aSeed * 23.0));
  vec2 xy = p.xy * scale * persp;
  xy.x /= uAspect;

  gl_Position = vec4(xy, 0.0, 1.0);
  vAccent = aAccent * wArc * (1.0 - wMark * 0.7);
  float speed = min(1.0, abs(uVelocity) * 2.2);
  gl_PointSize = min(12.0, uSize * persp * (0.7 + 1.3 * fract(aSeed * 7.31))
    * (1.0 + speed * 0.45) * (1.0 + vAccent * 0.7));
  vFade = (0.3 + 0.7 * fract(aSeed * 3.7)) * uOpacity * idleAlpha * (1.0 + vAccent * 0.5);
}`;

const FRAG = `
precision mediump float;
uniform vec3 uColor; uniform vec3 uAccentColor;
varying float vFade; varying float vAccent;
void main() {
  float dist = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.14, dist) * vFade;
  if (a < 0.004) discard;
  gl_FragColor = vec4(mix(uColor, uAccentColor, vAccent), a);
}`;

/**
 * Deterministic figures: the same seed on every mount keeps hydration, resize
 * and reloads quiet. Positions live in a space where y spans roughly -1..1 of
 * the viewport; the shader divides x by aspect.
 */
function figures(n: number) {
  let state = 42;
  const rnd = () => ((state = (state * 1664525 + 1013904223) >>> 0) / 4294967296);
  const dust = new Float32Array(n * 3);
  const ring = new Float32Array(n * 3);
  const arc = new Float32Array(n * 3);
  const mark = new Float32Array(n * 3);
  const seed = new Float32Array(n);
  const accent = new Float32Array(n);

  /* The trajectory's four knots: TU/e, Stacklink, Cape, Antler. They are the
     only points the accent color ever touches. */
  const knots = [0.1, 0.38, 0.64, 0.9];

  for (let i = 0; i < n; i++) {
    seed[i] = rnd();

    /* Dust: a loose field with depth, denser toward the lower half, the way
       dust actually sits in a beam of stage light. */
    const dy = (rnd() ** 0.8) * 2.2 - 1.15;
    dust.set([(rnd() * 2 - 1) * 2.1, dy, (rnd() * 2 - 1) * 0.55], i * 3);

    /* Ring: the spotlight aperture, with a vertical beam through it. */
    const rp = rnd();
    if (rp < 0.72) {
      const a = rnd() * Math.PI * 2;
      const r = 0.92 + (rnd() - 0.5) * 0.09;
      ring.set([Math.cos(a) * r, Math.sin(a) * r, (rnd() - 0.5) * 0.12], i * 3);
    } else if (rp < 0.88) {
      ring.set([(rnd() - 0.5) * 0.02, (rnd() * 2 - 1) * 1.3, (rnd() - 0.5) * 0.1], i * 3);
    } else {
      const a = rnd() * Math.PI * 2;
      const r = 1.15 + rnd() * 0.7;
      ring.set([Math.cos(a) * r, Math.sin(a) * r * 0.8, (rnd() - 0.5) * 0.5], i * 3);
    }

    /* Arc: the career line, rising left to right, with four denser knots. */
    const ap = rnd();
    let t: number;
    let isKnot = false;
    if (ap < 0.34) {
      t = knots[Math.floor(rnd() * 4)] + (rnd() - 0.5) * 0.05;
      isKnot = true;
    } else {
      t = rnd();
    }
    t = Math.max(0, Math.min(1, t));
    const spread = isKnot ? 0.028 : 0.02 + rnd() * 0.05;
    arc.set(
      [
        -1.45 + t * 2.9 + (rnd() - 0.5) * spread * 2,
        -0.72 + 1.5 * t ** 1.4 + (rnd() - 0.5) * spread * 2,
        (rnd() - 0.5) * (isKnot ? 0.04 : 0.3),
      ],
      i * 3,
    );
    accent[i] = isKnot && rnd() < 0.5 ? 1 : 0;

    /* Mark: the LD monogram as four strokes, plus a faint halo. */
    const mp = rnd();
    const thick = () => (rnd() - 0.5) * 0.05;
    if (mp < 0.88) {
      // Stroke lengths: L-stem 1.0, L-foot 0.42, D-stem 1.0, D-bowl ~1.62.
      const pick = rnd() * 4.04;
      let x: number;
      let y: number;
      if (pick < 1.0) {
        x = -0.62; y = pick - 0.5; // L stem
      } else if (pick < 1.42) {
        x = -0.62 + (pick - 1.0); y = -0.5; // L foot
      } else if (pick < 2.42) {
        x = 0.02; y = pick - 1.42 - 0.5; // D stem
      } else {
        const a = ((pick - 2.42) / 1.62) * Math.PI - Math.PI / 2; // D bowl
        x = 0.02 + Math.cos(a) * 0.5;
        y = Math.sin(a) * 0.5;
      }
      mark.set([x + thick(), y + thick(), (rnd() - 0.5) * 0.05], i * 3);
    } else {
      const a = rnd() * Math.PI * 2;
      const r = 0.95 + rnd() * 0.85;
      mark.set([Math.cos(a) * r, Math.sin(a) * r * 0.7, (rnd() - 0.5) * 0.5], i * 3);
    }
  }
  return { dust, ring, arc, mark, seed, accent };
}

const ratio = () => Math.min(devicePixelRatio || 1, 1.25);
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const IDLE_FRAME_MS = 42; // ~24fps while the dust drifts; scroll runs full rate

export class FilmScene {
  private gl: WebGLRenderingContext;
  private uniforms: Record<string, WebGLUniformLocation | null> = {};
  private count: number;
  private raf = 0;
  private visible = true;
  private still = false;
  private progress = 0;
  private velocity = 0;
  private time = 0;
  private lastInput = 0;
  private lastFrame = 0;
  private lastIdleDraw = 0;
  private settleUntil = 0;
  private io: IntersectionObserver;
  private ro: ResizeObserver;
  private background: [number, number, number] = [0, 0, 0];

  constructor(private canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'high-performance',
    });
    if (!gl) throw new Error('no webgl');
    this.gl = gl;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    this.count = Math.min(innerWidth, innerHeight * 1.6) < 720 ? 2000 : 3600;
    const f = figures(this.count);
    const attach = (name: string, data: Float32Array, size: number) => {
      const loc = gl.getAttribLocation(program, name);
      if (loc < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    attach('aDust', f.dust, 3);
    attach('aRing', f.ring, 3);
    attach('aArc', f.arc, 3);
    attach('aMark', f.mark, 3);
    attach('aSeed', f.seed, 1);
    attach('aAccent', f.accent, 1);

    for (const name of [
      'uProgress', 'uTime', 'uVelocity', 'uSize', 'uOpacity',
      'uAspect', 'uFit', 'uCalm', 'uColor', 'uAccentColor',
    ]) {
      this.uniforms[name] = gl.getUniformLocation(program, name);
    }

    gl.enable(gl.BLEND);
    // Normal blending: ink settling on paper, not light added to darkness.
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1f(this.uniforms.uOpacity, 0.85);

    const tokens = readFilmTokens();
    this.background = tokens.background;
    gl.uniform3fv(this.uniforms.uColor, tokens.point);
    gl.uniform3fv(this.uniforms.uAccentColor, tokens.accent);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();

    this.io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible) this.schedule();
      else if (this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = 0;
      }
    });
    this.io.observe(canvas);
  }

  /** Reduced motion mounts the finished mark and never schedules a frame. */
  mount(still: boolean) {
    this.still = still;
    this.progress = still ? 1 : 0;
    this.gl.uniform1f(this.uniforms.uProgress, this.progress);
    this.renderOnce();
    if (!still) this.schedule();
  }

  setProgress(value: number, calm = 0) {
    if (this.still) return;
    this.gl.uniform1f(this.uniforms.uCalm, clamp01(calm));
    const next = clamp01(value);
    if (Math.abs(next - this.progress) < 0.00001) return;
    const now = performance.now();
    const elapsed = Math.max(8, Math.min(80, now - this.lastInput || 16));
    const raw = Math.max(-1, Math.min(1, ((next - this.progress) / elapsed) * 240));
    this.velocity = this.velocity * 0.4 + raw * 0.6;
    this.lastInput = now;
    this.progress = next;
    this.settleUntil = now + 160;
    this.schedule();
  }

  private resize() {
    const gl = this.gl;
    const w = Math.max(1, Math.round(this.canvas.clientWidth * ratio()));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * ratio()));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    const aspect = w / h;
    gl.uniform1f(this.uniforms.uAspect, aspect);
    gl.uniform1f(this.uniforms.uFit, Math.max(0.5, Math.min(1, aspect / 1.15)));
    gl.uniform1f(this.uniforms.uSize, 4.6 * ratio());
    this.renderOnce();
  }

  private schedule() {
    if (!this.visible || this.raf || this.still) return;
    this.lastFrame = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    this.raf = 0;
    if (!this.visible || this.still) return;
    const elapsed = Math.min(64, now - this.lastFrame);
    this.lastFrame = now;

    const settling = now < this.settleUntil;
    if (settling) this.velocity *= Math.exp(-elapsed / 60);
    else this.velocity = 0;

    const idling = this.progress < 0.16;
    if (idling) this.time += elapsed / 1000;

    /* Settling draws every frame; idle drift draws at ~24fps and otherwise
       just keeps time moving so the drift never stutters on resume. */
    if (settling || !idling || now - this.lastIdleDraw >= IDLE_FRAME_MS) {
      this.lastIdleDraw = now;
      this.renderOnce();
    }
    if (settling || idling) this.schedule();
  };

  private renderOnce() {
    const gl = this.gl;
    gl.uniform1f(this.uniforms.uProgress, this.progress);
    gl.uniform1f(this.uniforms.uVelocity, this.velocity);
    gl.uniform1f(this.uniforms.uTime, this.time);
    const [r, g, b] = this.background;
    gl.clearColor(r, g, b, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, this.count);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.io.disconnect();
    this.ro.disconnect();
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
