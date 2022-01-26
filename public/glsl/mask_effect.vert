precision mediump float;

attribute vec2 a_position;
attribute vec2 a_uv;

uniform float u_scale;

varying vec2 v_uv;
varying vec2 v_vertex;

void main() {

    vec2 scalePosition = a_position * u_scale;

    gl_Position = vec4(scalePosition.x, scalePosition.y, 0.0, 1.0);
    v_vertex = vec2(gl_Position.x, gl_Position.y);
    v_uv = a_uv;
}