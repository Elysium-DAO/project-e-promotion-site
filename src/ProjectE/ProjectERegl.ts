import REGL, {Framebuffer, Regl, Texture, Texture2D} from 'regl';

export interface CustomReglPropType {
    position : number[][],
    time : number,
    mousePos : number[],
    isMouseEnable : number,
    textureLerpValue : number,
    textureAspectRatio : number,
    screenAspectRatio : number,
}

type CommandCallbackTYpe = () => void


export function ExecuteREGLCommand(regl : Regl, drawCommand : REGL.DrawCommand, vertexAttrType : CustomReglPropType) {    
    drawCommand({
        position : vertexAttrType.position,
        time : (vertexAttrType.time),
        mousePos : (vertexAttrType.mousePos),
        textureAspectRatio : vertexAttrType.textureAspectRatio,
        screenAspectRatio : vertexAttrType.screenAspectRatio,
        isMouseEnable : vertexAttrType.isMouseEnable,
        textureLerpValue : vertexAttrType.textureLerpValue,    
    });
}

export function CreateFrameBufferCommand(regl : Regl, frameBuffer : Framebuffer, frameBufferTex : Texture2D,
    vertex : string, fragment : string, noiseTex: HTMLImageElement,
    a_uv : number[][], scale : number, minRevealRange : number, vertex_count: number) {

    return regl({
        framebuffer: frameBuffer,
        frag: fragment,
        vert: vertex,

        attributes: {
            a_position: regl.prop<CustomReglPropType, "position">("position"),
            a_uv :  a_uv,
        },

        uniforms: {
            u_scale : scale,
            u_noise_tex : regl.texture({data:noiseTex, wrap  : "repeat"}),
            u_min_reveal_range: minRevealRange,
            u_reveal_map_tex: frameBufferTex,

            u_tex_aspect_ratio: regl.prop<CustomReglPropType, "textureAspectRatio">("textureAspectRatio"),
            u_screen_aspect_ratio: regl.prop<CustomReglPropType, "screenAspectRatio">("screenAspectRatio"),

            u_time: regl.prop<CustomReglPropType, "time">("time"),
            u_mousePos: regl.prop<CustomReglPropType, "mousePos">("mousePos"),
            u_isMouseEnable: regl.prop<CustomReglPropType, "isMouseEnable">("isMouseEnable"),
        },

        count: vertex_count
    });
}

export function CreateCanvasREGLCommand(regl : Regl, frameBuffer : Framebuffer, vertex : string, fragment : string, 
    noiseTex: HTMLImageElement, frontTexA : REGL.Texture, highlightTexA: REGL.Texture, frontTexB : REGL.Texture, highlightTexB: REGL.Texture,
    a_uv : number[][], scale : number, minRevealRange : number, isMobile: number, vertex_count: number
    ) {
    return regl({
        frag: fragment,
        vert: vertex,

        attributes: {
            a_position: regl.prop<CustomReglPropType, "position">("position"),
            a_uv :  a_uv,
        },

        uniforms: {
            u_scale : scale,

            u_noise_tex : regl.texture({data:noiseTex, wrap  : "repeat"}),
            u_front_tex_a : frontTexA,
            u_highlight_tex_a : highlightTexA,
            u_front_tex_b : frontTexB,
            u_highlight_tex_b : highlightTexB,
            u_reveal_map_tex: frameBuffer, 
            u_min_reveal_range: minRevealRange,
            u_is_mobile: isMobile,
            u_tex_aspect_ratio: regl.prop<CustomReglPropType, "textureAspectRatio">("textureAspectRatio"),
            u_time: regl.prop<CustomReglPropType, "time">("time"),
            u_mousePos: regl.prop<CustomReglPropType, "mousePos">("mousePos"),
            u_isMouseEnable: regl.prop<CustomReglPropType, "isMouseEnable">("isMouseEnable"),
            u_textureLerpValue: regl.prop<CustomReglPropType, "textureLerpValue">("textureLerpValue"),
        },

        count: vertex_count
    });
}