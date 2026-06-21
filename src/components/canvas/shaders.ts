export const PARTICLE_VERTEX = `#version 300 es
precision mediump float;

in vec2 a_position;
in float a_radius;
in float a_opacity;
in float a_colorIndex;

uniform vec2 u_resolution;
uniform float u_pixelRatio;

out float v_opacity;
out float v_colorIndex;

void main() {
  vec2 clipPos = (a_position / u_resolution) * 2.0 - 1.0;
  clipPos.y *= -1.0;
  gl_Position = vec4(clipPos, 0.0, 1.0);
  gl_PointSize = a_radius * 2.0 * u_pixelRatio;
  v_opacity = a_opacity;
  v_colorIndex = a_colorIndex;
}`;

export const PARTICLE_FRAGMENT = `#version 300 es
precision mediump float;

in float v_opacity;
in float v_colorIndex;
out vec4 fragColor;

void main() {
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center) * 2.0;
  if (dist > 1.0) discard;
  float alpha = (1.0 - dist * dist) * v_opacity;

  vec3 color;
  int idx = int(v_colorIndex + 0.5);
  if (idx == 0) color = vec3(0.102, 0.227, 0.361);
  else if (idx == 1) color = vec3(0.231, 0.431, 0.659);
  else if (idx == 2) color = vec3(0.373, 0.659, 1.000);
  else color = vec3(0.647, 0.847, 1.000);

  fragColor = vec4(color, alpha);
}`;

export const CONNECTION_VERTEX = `#version 300 es
precision mediump float;

in vec2 a_position;
in float a_opacity;

uniform vec2 u_resolution;

out float v_opacity;

void main() {
  vec2 clipPos = (a_position / u_resolution) * 2.0 - 1.0;
  clipPos.y *= -1.0;
  gl_Position = vec4(clipPos, 0.0, 1.0);
  v_opacity = a_opacity;
}`;

export const CONNECTION_FRAGMENT = `#version 300 es
precision mediump float;

in float v_opacity;
out vec4 fragColor;

void main() {
  fragColor = vec4(0.18, 0.49, 1.0, v_opacity);
}`;
