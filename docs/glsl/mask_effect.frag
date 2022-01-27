precision highp float;

uniform float u_time;
uniform vec2 u_mousePos;
uniform float u_isMouseEnable;
uniform float u_min_reveal_range;
uniform float u_textureLerpValue;
uniform float u_tex_aspect_ratio;
uniform float u_is_mobile;

uniform sampler2D u_front_tex_a;
uniform sampler2D u_highlight_tex_a;
uniform sampler2D u_front_tex_b;
uniform sampler2D u_highlight_tex_b;

uniform sampler2D u_reveal_map_tex;
uniform sampler2D u_noise_tex;

varying vec2 v_uv;  
varying vec2 v_vertex;  

void main() {
    vec2 uv = vec2(v_uv.x, v_uv.y);
    vec2 centeruv = vec2(((uv.x - 0.5) * u_tex_aspect_ratio) + 0.5, uv.y);
    vec4 returnColor = vec4(v_uv.x, v_uv.y, 0.0, 1.0);
    vec4 easeMapTex = texture2D(u_reveal_map_tex, centeruv);

    float scaleLerpValue = (u_textureLerpValue * 2.0) - 1.0;
    float noiseStr = clamp( (-4.5 * pow(scaleLerpValue, 2.0))+ 4.3, 0.0, 1.0);

    float t = u_time * 0.5;
    vec4 noiseOffset = texture2D(u_noise_tex, vec2(uv.x + t,  uv.y + sin(t) * 0.25));
    float normalizeOffset =  ((noiseOffset.x * 2.0) - 1.0) * 0.02 * noiseStr;

    vec2 texUV = vec2(uv.x + normalizeOffset, uv.y + normalizeOffset);
    vec4 frontTexA = texture2D(u_front_tex_a, texUV );
    vec4 highlightTexA = texture2D(u_highlight_tex_a, texUV);
    vec4 frontTexB = texture2D(u_front_tex_b, texUV);
    vec4 highlightTexB = texture2D(u_highlight_tex_b, texUV);

    vec4 targetFrontTex = mix(frontTexA, frontTexB, u_textureLerpValue);
    vec4 targetHighlightTex = mix(highlightTexA, highlightTexB, u_textureLerpValue);

    float dist = 1.0 - distance(v_vertex, u_mousePos);
    float mousePosLerp = smoothstep(u_min_reveal_range, 1.0, dist) * u_isMouseEnable;
    float lerpMix = mix(easeMapTex.x, mousePosLerp, u_is_mobile);
    vec4 revealCol = mix(targetFrontTex, targetHighlightTex, lerpMix);

    //gl_FragColor = vec4(mousePosLerp, mousePosLerp, mousePosLerp, 1.0);
    gl_FragColor = revealCol;
    //gl_FragColor = easeMapTex;
}