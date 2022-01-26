import REGL, {Regl} from 'regl';
import {VertexAttributeType} from './ProjectEType';

export interface CustomReglPropType {
    position : number[][],
    time : number,
    mousePos : number[],
    isMouseEnable : number,
    textureIdentifier : number,
    textureLerpValue : number,
}

export function ExecuteREGLCommand(regl : Regl, drawCommand : REGL.DrawCommand, vertexAttrType : CustomReglPropType) {    
    drawCommand({
        position : vertexAttrType.position,
        time : (vertexAttrType.time),
        mousePos : (vertexAttrType.mousePos),
        isMouseEnable : vertexAttrType.isMouseEnable,
        textureIdentifier : vertexAttrType.textureIdentifier,
        textureLerpValue : vertexAttrType.textureLerpValue,    
    });
}

export function CreateREGLCommandObj(regl : Regl, vertex : string, fragment : string, 
    noiseTex: HTMLImageElement,
    frontTexA : REGL.Texture, highlightTexA: REGL.Texture, frontTexB : REGL.Texture, highlightTexB: REGL.Texture,
    a_uv : number[][], scale : number, vertex_count: number
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

            u_time: regl.prop<CustomReglPropType, "time">("time"),
            u_mousePos: regl.prop<CustomReglPropType, "mousePos">("mousePos"),
            u_isMouseEnable: regl.prop<CustomReglPropType, "isMouseEnable">("isMouseEnable"),

            u_textureIdentifier: regl.prop<CustomReglPropType, "textureIdentifier">("textureIdentifier"),
            u_textureLerpValue: regl.prop<CustomReglPropType, "textureLerpValue">("textureLerpValue"),
        },

        count: vertex_count
    });
}