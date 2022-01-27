precision mediump float;

uniform float u_time;
uniform vec2 u_mousePos;
uniform float u_isMouseEnable;
uniform float u_min_reveal_range;

uniform sampler2D u_noise_tex;
uniform sampler2D u_reveal_map_tex;

varying vec2 v_uv;  
varying vec2 v_vertex;  

void main() {
    vec2 uv = vec2(v_uv.x, v_uv.y);

    vec2 centeruv = vec2(((uv.x - 0.5) * 2.0) + 0.5, uv.y);

    vec4 revealTex = texture2D(u_reveal_map_tex, uv);

    // float scaleLerpValue = (u_textureLerpValue * 2.0) - 1.0;
    // float noiseStr = clamp( (-4.5 * pow(scaleLerpValue, 2.0))+ 4.3, 0.0, 1.0);

    // float t = u_time * 0.5;
    // vec4 noiseOffset = texture2D(u_noise_tex, vec2(uv.x + t,  uv.y + sin(t) * 0.25));
    // float normalizeOffset =  ((noiseOffset.x * 2.0) - 1.0) * 0.02 * noiseStr;
    // vec2 v = vec2(v_vertex.x * 2.0, v_vertex.y);

    // float dist = distance(v, u_mousePos) * -1.0;
    // float lerpV = smoothstep(-0.1, 0.0, dist);

    vec4 decay = vec4(0.01, 0.01, 0.01, 0.0);
    revealTex += decay;
    //if (lerpV > revealTex.x )
        //revealTex.x = lerpV;

    gl_FragColor = vec4(revealTex.x, revealTex.x, revealTex.x, 1.0);
    //vec4(revealTex, dist, 0.0, 1.0);
}