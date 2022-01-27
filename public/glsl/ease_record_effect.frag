precision mediump float;

uniform sampler2D u_ease_fbo;

varying vec2 v_uv;
varying vec2 v_vertex;

void main() {
    vec2 uv = vec2(v_uv.x, v_uv.y);
    vec4 easeMapTex = texture2D(u_ease_fbo, v_uv);

    gl_FragColor = easeMapTex;
}