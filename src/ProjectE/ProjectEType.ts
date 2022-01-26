export interface ProjectEConfig {
    mouse_dom : string,
    mask_radius : number,

    comingsoon_dom : string,
    webgl_dom : string,
    vertex_path : string,
    frag_path : string,
    noise_tex_path: string,
    
    texture_rotation_time: number,
    texture_transition_time: number,

    desktop_textures: MaskTextureType
    mobile_textures: MaskTextureType
}

export interface VertexAttributeType {
    time : number,// Vector2    
    mainColor : number[],
}

export interface MaskTextureType {
    front_textures : string[],
    highlight_textures: string[],
    scale: number,
    count : number
}

export interface InputInteractionType {
    mouse_screenpos_x: number,
    mouse_screenpos_y: number,

    input_enable: boolean,
}