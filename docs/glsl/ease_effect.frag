precision mediump float;

uniform float u_time;
uniform vec2 u_mousePos;
uniform float u_isMouseEnable;
uniform float u_min_reveal_range;
uniform float u_tex_aspect_ratio;
uniform float u_screen_aspect_ratio;
uniform sampler2D u_noise_tex;
uniform sampler2D u_reveal_map_tex;

varying vec2 v_uv;  
varying vec2 v_vertex;  

void main() {
    vec2 uv = vec2(v_uv.x, v_uv.y);

    vec2 centeruv = vec2(((uv.x - 0.5) * u_tex_aspect_ratio) + 0.5, uv.y);

    float revealVal = texture2D(u_reveal_map_tex, centeruv).x;

    vec2 v = vec2(v_vertex.x * u_screen_aspect_ratio, v_vertex.y);
    v.x -= u_mousePos.x * (u_screen_aspect_ratio - 1.0);

     float dist = distance(v, u_mousePos) * -1.0;
     float lerpV = smoothstep(-0.2, 0.0, dist);

    float decay = 0.01;
    revealVal -= decay;

    lerpV = smoothstep(-0.3, 0.0, dist);

      if (lerpV >= revealVal )
          revealVal = lerpV;

    gl_FragColor = vec4(revealVal, revealVal, revealVal, 1.0);
    //vec4(revealTex, dist, 0.0, 1.0);
}