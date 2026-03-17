import { simplex2D } from '@/lib/noise';
import {
  PARTICLE_VERTEX,
  PARTICLE_FRAGMENT,
  CONNECTION_VERTEX,
  CONNECTION_FRAGMENT,
} from './shaders';
import { SpatialHash } from './spatialHash';

// ── Constants ──────────────────────────────────────────────────────────
const NOISE_SCALE = 0.0008;
const NOISE_SPEED = 0.00012;
const BASE_SPEED = 0.15;
const SPRING_K = 0.0003;
const DAMPING = 0.97;
const SHIMMER_SPEED = 0.003;
const SHIMMER_AMPLITUDE = 0.06;
const CONNECTION_MAX_DIST = 150;
const CONNECTION_MAX_PER_PARTICLE = 4;
const CONNECTION_OPACITY_MULTIPLIER = 0.15;

const MOUSE_RADIUS = 200;
const MOUSE_FORCE = 0.08;
const VIEWPORT_MARGIN = 200;
const DOCUMENT_HEIGHT_ESTIMATE = 6000;

// ── Ripple ─────────────────────────────────────────────────────────────
interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  strength: number;
  decay: number;
}

// ── Quality levels ─────────────────────────────────────────────────────
const QUALITY_FRACTIONS = [1.0, 0.85, 0.65, 0.45, 0.3];

// ── Helpers ────────────────────────────────────────────────────────────
function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vsSource: string,
  fsSource: string,
): WebGLProgram | null {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  // Shaders are linked; safe to delete references
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}

// ── ParticleSystem ─────────────────────────────────────────────────────
export class ParticleSystem {
  // WebGL
  private gl: WebGL2RenderingContext | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private particleProgram: WebGLProgram | null = null;
  private connectionProgram: WebGLProgram | null = null;

  // Particle VAO / buffers
  private particleVAO: WebGLVertexArrayObject | null = null;
  private posBuffer: WebGLBuffer | null = null;
  private radiusBuffer: WebGLBuffer | null = null;
  private opacityBuffer: WebGLBuffer | null = null;
  private colorBuffer: WebGLBuffer | null = null;

  // Connection VAO / buffers
  private connVAO: WebGLVertexArrayObject | null = null;
  private connPosBuffer: WebGLBuffer | null = null;
  private connOpacityBuffer: WebGLBuffer | null = null;

  // Uniform locations - particles
  private pResolutionLoc: WebGLUniformLocation | null = null;
  private pPixelRatioLoc: WebGLUniformLocation | null = null;
  // Uniform locations - connections
  private cResolutionLoc: WebGLUniformLocation | null = null;

  // Struct-of-arrays particle data
  private count = 0;
  private activeCount = 0;
  private posX!: Float32Array;
  private posY!: Float32Array;
  private homeX!: Float32Array;
  private homeY!: Float32Array;
  private velX!: Float32Array;
  private velY!: Float32Array;
  private radius!: Float32Array;
  private baseOpacity!: Float32Array;
  private opacity!: Float32Array;
  private colorIndex!: Float32Array;
  private shimmerPhase!: Float32Array;

  // GPU upload arrays
  private gpuPos!: Float32Array;
  private gpuOpacity!: Float32Array;

  // Connection scratch buffers
  private connPosData!: Float32Array;
  private connOpacityData!: Float32Array;
  private connVertexCount = 0;
  private maxConnVertices = 0;

  // Spatial hash
  private spatialHash = new SpatialHash(CONNECTION_MAX_DIST);

  // Ripples
  private ripples: Ripple[] = [];

  // Viewport
  private width = 0;
  private height = 0;
  private pixelRatio = 1;

  // Context lost handling
  private contextLost = false;
  private boundContextLost: ((e: Event) => void) | null = null;
  private boundContextRestored: ((e: Event) => void) | null = null;

  // ── init ───────────────────────────────────────────────────────────
  init(canvas: HTMLCanvasElement, count: number): boolean {
    this.canvas = canvas;
    this.count = count;
    this.activeCount = count;

    // Get WebGL 2 context
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    });
    if (!gl) {
      console.warn('WebGL 2 not available');
      return false;
    }
    this.gl = gl;
    this.pixelRatio = typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1;

    // Context lost / restored
    this.boundContextLost = (e: Event) => {
      e.preventDefault();
      this.contextLost = true;
    };
    this.boundContextRestored = () => {
      this.contextLost = false;
      this.setupGL();
    };
    canvas.addEventListener('webglcontextlost', this.boundContextLost);
    canvas.addEventListener('webglcontextrestored', this.boundContextRestored);

    // Allocate particle arrays
    this.allocateArrays(count);
    this.initParticles(count);

    // GL setup
    if (!this.setupGL()) return false;

    return true;
  }

  // ── allocateArrays ─────────────────────────────────────────────────
  private allocateArrays(n: number) {
    this.posX = new Float32Array(n);
    this.posY = new Float32Array(n);
    this.homeX = new Float32Array(n);
    this.homeY = new Float32Array(n);
    this.velX = new Float32Array(n);
    this.velY = new Float32Array(n);
    this.radius = new Float32Array(n);
    this.baseOpacity = new Float32Array(n);
    this.opacity = new Float32Array(n);
    this.colorIndex = new Float32Array(n);
    this.shimmerPhase = new Float32Array(n);

    // GPU upload
    this.gpuPos = new Float32Array(n * 2);
    this.gpuOpacity = new Float32Array(n);

    // Connection buffers (worst case: each visible particle has 4 connections = 8 vertices)
    this.maxConnVertices = n * CONNECTION_MAX_PER_PARTICLE * 2;
    this.connPosData = new Float32Array(this.maxConnVertices * 2);
    this.connOpacityData = new Float32Array(this.maxConnVertices);
  }

  // ── initParticles - stratified random sampling ─────────────────────
  private initParticles(n: number) {
    const w = this.canvas?.width ?? 1920;
    // Stratified grid
    const cols = Math.ceil(Math.sqrt((n * w) / DOCUMENT_HEIGHT_ESTIMATE));
    const rows = Math.ceil(n / cols);
    const cellW = w / cols;
    const cellH = DOCUMENT_HEIGHT_ESTIMATE / rows;

    for (let i = 0; i < n; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = (col + Math.random()) * cellW;
      const y = (row + Math.random()) * cellH;

      this.posX[i] = x;
      this.posY[i] = y;
      this.homeX[i] = x;
      this.homeY[i] = y;
      this.velX[i] = 0;
      this.velY[i] = 0;

      // Radius biased toward small
      this.radius[i] = 1.0 + Math.pow(Math.random(), 1.8) * 2.5;

      // Color distribution: 40% dim(0), 30% mid(1), 20% active(2), 10% hot(3)
      const r = Math.random();
      if (r < 0.4) this.colorIndex[i] = 0;
      else if (r < 0.7) this.colorIndex[i] = 1;
      else if (r < 0.9) this.colorIndex[i] = 2;
      else this.colorIndex[i] = 3;

      this.baseOpacity[i] = 0.08 + Math.random() * 0.37;
      this.opacity[i] = this.baseOpacity[i];
      this.shimmerPhase[i] = Math.random() * Math.PI * 2;
    }
  }

  // ── setupGL ────────────────────────────────────────────────────────
  private setupGL(): boolean {
    const gl = this.gl;
    if (!gl) return false;

    // Programs
    this.particleProgram = createProgram(gl, PARTICLE_VERTEX, PARTICLE_FRAGMENT);
    this.connectionProgram = createProgram(gl, CONNECTION_VERTEX, CONNECTION_FRAGMENT);
    if (!this.particleProgram || !this.connectionProgram) return false;

    // Blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // ── Particle VAO ──
    this.particleVAO = gl.createVertexArray();
    gl.bindVertexArray(this.particleVAO);

    const pp = this.particleProgram;

    // position
    this.posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.gpuPos.byteLength, gl.DYNAMIC_DRAW);
    const aPosLoc = gl.getAttribLocation(pp, 'a_position');
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    // radius
    this.radiusBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.radiusBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.radius.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.radius);
    const aRadLoc = gl.getAttribLocation(pp, 'a_radius');
    gl.enableVertexAttribArray(aRadLoc);
    gl.vertexAttribPointer(aRadLoc, 1, gl.FLOAT, false, 0, 0);

    // opacity
    this.opacityBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.opacityBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.gpuOpacity.byteLength, gl.DYNAMIC_DRAW);
    const aOpLoc = gl.getAttribLocation(pp, 'a_opacity');
    gl.enableVertexAttribArray(aOpLoc);
    gl.vertexAttribPointer(aOpLoc, 1, gl.FLOAT, false, 0, 0);

    // colorIndex
    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.colorIndex.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.colorIndex);
    const aColLoc = gl.getAttribLocation(pp, 'a_colorIndex');
    gl.enableVertexAttribArray(aColLoc);
    gl.vertexAttribPointer(aColLoc, 1, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);

    // Uniform locations - particles
    this.pResolutionLoc = gl.getUniformLocation(pp, 'u_resolution');
    this.pPixelRatioLoc = gl.getUniformLocation(pp, 'u_pixelRatio');

    // ── Connection VAO ──
    this.connVAO = gl.createVertexArray();
    gl.bindVertexArray(this.connVAO);

    const cp = this.connectionProgram;

    this.connPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.connPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.connPosData.byteLength, gl.DYNAMIC_DRAW);
    const caPosLoc = gl.getAttribLocation(cp, 'a_position');
    gl.enableVertexAttribArray(caPosLoc);
    gl.vertexAttribPointer(caPosLoc, 2, gl.FLOAT, false, 0, 0);

    this.connOpacityBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.connOpacityBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.connOpacityData.byteLength, gl.DYNAMIC_DRAW);
    const caOpLoc = gl.getAttribLocation(cp, 'a_opacity');
    gl.enableVertexAttribArray(caOpLoc);
    gl.vertexAttribPointer(caOpLoc, 1, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);

    // Uniform locations - connections
    this.cResolutionLoc = gl.getUniformLocation(cp, 'u_resolution');

    return true;
  }

  // ── update ─────────────────────────────────────────────────────────
  update(
    time: number,
    scrollY: number,
    viewportHeight: number,
    mouseX: number,
    mouseY: number,
    mousePressed: boolean,
  ) {
    if (this.contextLost) return;

    const n = this.activeCount;
    const viewTop = scrollY - VIEWPORT_MARGIN;
    const viewBottom = scrollY + viewportHeight + VIEWPORT_MARGIN;
    const mouseWorldY = mouseY + scrollY;

    // Handle click ripple
    if (mousePressed) {
      this.ripples.push({
        x: mouseX,
        y: mouseWorldY,
        radius: 0,
        maxRadius: 400,
        speed: 8,
        strength: 1,
        decay: 0.015,
      });
    }

    // Update ripples
    for (let r = this.ripples.length - 1; r >= 0; r--) {
      const rip = this.ripples[r];
      rip.radius += rip.speed;
      rip.strength -= rip.decay;
      if (rip.strength <= 0 || rip.radius > rip.maxRadius) {
        this.ripples.splice(r, 1);
      }
    }

    // Spatial hash for connections
    this.spatialHash.clear();

    // Physics + spatial hash insert
    const noiseTime = time * NOISE_SPEED;

    for (let i = 0; i < n; i++) {
      const py = this.posY[i];

      // Viewport culling
      if (py < viewTop || py > viewBottom) continue;

      const px = this.posX[i];

      // Noise flow field
      const angle = simplex2D(px * NOISE_SCALE, py * NOISE_SCALE + noiseTime) * Math.PI * 2;
      const flowX = Math.cos(angle) * BASE_SPEED;
      const flowY = Math.sin(angle) * BASE_SPEED;

      // Spring return
      const springX = (this.homeX[i] - px) * SPRING_K;
      const springY = (this.homeY[i] - py) * SPRING_K;

      // Accumulate velocity
      this.velX[i] = (this.velX[i] + flowX + springX) * DAMPING;
      this.velY[i] = (this.velY[i] + flowY + springY) * DAMPING;

      // Mouse attraction
      const mdx = mouseX - px;
      const mdy = mouseWorldY - py;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < MOUSE_RADIUS && mDist > 1) {
        const nd = mDist / MOUSE_RADIUS;
        const force = MOUSE_FORCE * (1 - nd) * (1 - nd);
        this.velX[i] += (mdx / mDist) * force;
        this.velY[i] += (mdy / mDist) * force;
      }

      // Ripple forces
      for (let r = 0; r < this.ripples.length; r++) {
        const rip = this.ripples[r];
        const rdx = px - rip.x;
        const rdy = py - rip.y;
        const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
        const ringDist = Math.abs(rDist - rip.radius);
        if (ringDist < 40 && rDist > 1) {
          const impulse = rip.strength * (1 - ringDist / 40) * 2;
          this.velX[i] += (rdx / rDist) * impulse;
          this.velY[i] += (rdy / rDist) * impulse;
        }
      }

      // Integrate
      this.posX[i] = px + this.velX[i];
      this.posY[i] = py + this.velY[i];

      // Shimmer
      const shimmer =
        Math.sin(time * SHIMMER_SPEED + this.shimmerPhase[i]) * SHIMMER_AMPLITUDE;
      this.opacity[i] = Math.max(0, Math.min(1, this.baseOpacity[i] + shimmer));

      // Insert into spatial hash (use screen-relative coords for connection drawing)
      this.spatialHash.insert(i, px, py);
    }

    // ── Build connections ──
    this.connVertexCount = 0;
    let cIdx = 0;
    let oIdx = 0;
    const maxDistSq = CONNECTION_MAX_DIST * CONNECTION_MAX_DIST;
    const processed = new Uint8Array(n); // connection count per particle

    for (let i = 0; i < n; i++) {
      const py = this.posY[i];
      if (py < viewTop || py > viewBottom) continue;
      if (processed[i] >= CONNECTION_MAX_PER_PARTICLE) continue;

      const px = this.posX[i];
      const neighbors = this.spatialHash.query(px, py);

      for (let ni = 0; ni < neighbors.length; ni++) {
        const j = neighbors[ni];
        if (j <= i) continue;
        if (processed[i] >= CONNECTION_MAX_PER_PARTICLE) break;
        if (processed[j] >= CONNECTION_MAX_PER_PARTICLE) continue;

        const dx = this.posX[j] - px;
        const dy = this.posY[j] - py;
        const distSq = dx * dx + dy * dy;
        if (distSq > maxDistSq || distSq < 1) continue;

        const dist = Math.sqrt(distSq);
        let connOpacity = (1 - dist / CONNECTION_MAX_DIST) * CONNECTION_OPACITY_MULTIPLIER;

        // Mouse proximity boost
        const midX = (px + this.posX[j]) * 0.5;
        const midY = (py + this.posY[j]) * 0.5;
        const mmdx = mouseX - midX;
        const mmdy = mouseWorldY - midY;
        const mmDist = Math.sqrt(mmdx * mmdx + mmdy * mmdy);
        if (mmDist < MOUSE_RADIUS) {
          connOpacity *= 2.5;
        }

        connOpacity = Math.min(connOpacity, 1);

        // Bounds check
        if (cIdx + 4 > this.connPosData.length) break;

        // Line: two vertices
        this.connPosData[cIdx++] = px;
        this.connPosData[cIdx++] = py;
        this.connPosData[cIdx++] = this.posX[j];
        this.connPosData[cIdx++] = this.posY[j];
        this.connOpacityData[oIdx++] = connOpacity;
        this.connOpacityData[oIdx++] = connOpacity;

        this.connVertexCount += 2;
        processed[i]++;
        processed[j]++;
      }
    }
  }

  // ── render ─────────────────────────────────────────────────────────
  render() {
    const gl = this.gl;
    if (!gl || this.contextLost) return;

    gl.viewport(0, 0, this.width, this.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const n = this.activeCount;

    // ── Draw connections ──
    if (this.connVertexCount > 0) {
      gl.useProgram(this.connectionProgram);
      gl.uniform2f(this.cResolutionLoc, this.width / this.pixelRatio, this.height / this.pixelRatio);

      gl.bindVertexArray(this.connVAO);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.connPosBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.connPosData.subarray(0, this.connVertexCount * 2));

      gl.bindBuffer(gl.ARRAY_BUFFER, this.connOpacityBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.connOpacityData.subarray(0, this.connVertexCount));

      gl.drawArrays(gl.LINES, 0, this.connVertexCount);
      gl.bindVertexArray(null);
    }

    // ── Draw particles ──
    // Pack position data
    for (let i = 0; i < n; i++) {
      this.gpuPos[i * 2] = this.posX[i];
      this.gpuPos[i * 2 + 1] = this.posY[i];
      this.gpuOpacity[i] = this.opacity[i];
    }

    gl.useProgram(this.particleProgram);
    gl.uniform2f(this.pResolutionLoc, this.width / this.pixelRatio, this.height / this.pixelRatio);
    gl.uniform1f(this.pPixelRatioLoc, this.pixelRatio);

    gl.bindVertexArray(this.particleVAO);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.gpuPos.subarray(0, n * 2));

    gl.bindBuffer(gl.ARRAY_BUFFER, this.opacityBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.gpuOpacity.subarray(0, n));

    gl.drawArrays(gl.POINTS, 0, n);
    gl.bindVertexArray(null);
  }

  // ── resize ─────────────────────────────────────────────────────────
  resize(width: number, height: number) {
    this.pixelRatio = typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1;
    this.width = width * this.pixelRatio;
    this.height = height * this.pixelRatio;
    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
  }

  // ── setQuality ─────────────────────────────────────────────────────
  setQuality(level: number) {
    const clamped = Math.max(0, Math.min(level, QUALITY_FRACTIONS.length - 1));
    this.activeCount = Math.floor(this.count * QUALITY_FRACTIONS[clamped]);
  }

  // ── destroy ────────────────────────────────────────────────────────
  destroy() {
    const gl = this.gl;
    if (gl) {
      if (this.particleVAO) gl.deleteVertexArray(this.particleVAO);
      if (this.connVAO) gl.deleteVertexArray(this.connVAO);
      if (this.posBuffer) gl.deleteBuffer(this.posBuffer);
      if (this.radiusBuffer) gl.deleteBuffer(this.radiusBuffer);
      if (this.opacityBuffer) gl.deleteBuffer(this.opacityBuffer);
      if (this.colorBuffer) gl.deleteBuffer(this.colorBuffer);
      if (this.connPosBuffer) gl.deleteBuffer(this.connPosBuffer);
      if (this.connOpacityBuffer) gl.deleteBuffer(this.connOpacityBuffer);
      if (this.particleProgram) gl.deleteProgram(this.particleProgram);
      if (this.connectionProgram) gl.deleteProgram(this.connectionProgram);
    }

    if (this.canvas) {
      if (this.boundContextLost) {
        this.canvas.removeEventListener('webglcontextlost', this.boundContextLost);
      }
      if (this.boundContextRestored) {
        this.canvas.removeEventListener('webglcontextrestored', this.boundContextRestored);
      }
    }

    this.gl = null;
    this.canvas = null;
  }
}
