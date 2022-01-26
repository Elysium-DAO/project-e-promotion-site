precision mediump float;

uniform float u_time;
uniform vec4 u_mainColor;
uniform vec2 u_mousePos;
uniform int u_isMouseEnable;
uniform int u_textureIdentifier;
uniform float u_textureLerpValue;

uniform sampler2D u_front_tex_a;
uniform sampler2D u_highlight_tex_a;
uniform sampler2D u_front_tex_b;
uniform sampler2D u_highlight_tex_b;

uniform sampler2D u_noise_tex;

varying vec2 v_uv;  
varying vec2 v_vertex;  

void main() {
    vec2 uv = vec2(v_uv.x, v_uv.y);
    vec4 returnColor = vec4(v_uv.x, v_uv.y, 0.0, 1.0);

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

    float minRange = 0.75;
    float dist = 1.0 - distance(v_vertex, u_mousePos);
    float lerpV = smoothstep(minRange, 1.0, dist);
    vec4 revealCol = mix(targetFrontTex, targetHighlightTex, lerpV);
    gl_FragColor = revealCol;
}