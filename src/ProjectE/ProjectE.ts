import WebGLCanvas from '../Utility/WebGL/WebglCanvas';
import WebglUtility from '../Utility/WebGL/WebglUtility';
import {ProjectEConfig} from './ProjectEType';
import REGL, {Regl} from 'regl';
import {CreateREGLCommandObj, ExecuteREGLCommand} from './ProjectERegl';
import CanvasInputHandler from '../Utility/Input/CanvasInputHandler';
import EventSystem from '../Utility/EventSystem';
import {NormalizeByRange, Lerp, Clamp} from '../Utility/UtilityMethod';

import TextAnimation from './Effect/TextAnimation';
import MouseAnimation from './Effect/MouseAnimation';
import { MaskHighLight } from './Effect/MaskHighlight';
import { PlaneVertex, CustomEventTypes } from '../Utility/UniversalType';

class ProjectE extends WebGLCanvas{
    webglUtility : WebglUtility;
    reglDrawCommand : REGL.DrawCommand;
    reglFrame : REGL.Cancellable;

    inputHandler : CanvasInputHandler;
    eventSystem : EventSystem;
    
    maskHighlight : MaskHighLight;
    //textAnimation: TextAnimation;
    mouseAnimation: MouseAnimation;

    public time : number;

    private _FrontTexA : REGL.Texture2D;
    private _HighlightTexA : REGL.Texture2D;
    private _FrontTexB : REGL.Texture2D;
    private _HighlightTexB : REGL.Texture2D;

    private _planeVertex : PlaneVertex;
    private _config: ProjectEConfig;
    private _blackColor : REGL.Vec4;
    private _clipMousePos = [0,0];

    constructor( config: ProjectEConfig) {
        super(config.webgl_dom);
        this._config = config;
        this.webglUtility = new WebglUtility();
        this.eventSystem = new EventSystem();
        this._blackColor = [0,0,0,1];
        
        this.maskHighlight = new MaskHighLight(this._webglDom, config);
        //this.textAnimation = new TextAnimation(config.comingsoon_dom, "COMING SOON", " . ",  1, 4);
        this.mouseAnimation = new MouseAnimation(config.mouse_dom, 0.8, this.maskHighlight.IsMobileDevice);

        this.inputHandler = new CanvasInputHandler(this._webglDom, this.eventSystem);
        this.eventSystem.ListenToEvent(CustomEventTypes.MouseMoveEvent, this.OnMouseMoveEvent.bind(this));
        this.eventSystem.ListenToEvent(CustomEventTypes.MouseUpEvent, this.OnMouseUpEvent.bind(this));
        this.eventSystem.ListenToEvent(CustomEventTypes.MouseDownEvent, this.OnMouseDownEvent.bind(this));

        this.InitProcess(config.vertex_path, config.frag_path);
    }

    async InitProcess(vertexFilePath : string, fragmentFilePath : string) {
        await this.maskHighlight.CacheMaskTexture();
        await this.SetupWebglPipeline(vertexFilePath, fragmentFilePath);

        //Draw the image in first frame
        this.DrawREGLCavnas();
    }

    async SetupWebglPipeline(vertexFilePath : string, fragmentFilePath : string) {
        this._reglContext  = await this.CreatREGLCanvas (this._webglDom);        
        let glslSetting = await this.webglUtility.PrepareREGLShader(vertexFilePath, fragmentFilePath);
        this._planeVertex = this.webglUtility.GetPlaneVertex();

        let textureASet = this.maskHighlight.GetPairTexture(0);
        let textureBSet = this.maskHighlight.GetPairTexture(1);

        if (textureBSet == null)
            textureBSet = textureASet;

        //Keep the first rotation longer with double set
        this._FrontTexA = this._reglContext.texture({data:textureASet[0], flipY: true});
        this._HighlightTexA = this._reglContext.texture({data:textureASet[1], flipY: true});
        this._FrontTexB = this._reglContext.texture({data:textureASet[0], flipY: true});
        this._HighlightTexB = this._reglContext.texture({data:textureASet[1], flipY: true});

        this.UpdatePlaneVertex();

        this.reglDrawCommand  = await CreateREGLCommandObj(
            this._reglContext,
            glslSetting.vertex_shader, 
            glslSetting.fragment_shader,
            this.maskHighlight._noise_texture,
            this._FrontTexA, 
            this._HighlightTexA, 
            this._FrontTexB, 
            this._HighlightTexB, 
            this._planeVertex.a_uv, 
            this.maskHighlight.maskTexType.scale,
            this.maskHighlight.maskTexType.mask_min_reveal_range,
            this._planeVertex.count);
    }

    DrawREGLCavnas() {
        this._reglContext.frame(({time}) => {

            let clipPos = this.ScreenPositionToClipSpace(this.maskHighlight.inputInteractionType.mouse_screenpos_x, this.maskHighlight.inputInteractionType.mouse_screenpos_y);

            // clear contents of the drawing buffer
            this._reglContext.clear({
                color: this._blackColor,
                depth: 1
            })
            
            ExecuteREGLCommand(this._reglContext, this.reglDrawCommand, 
            {
                position : this._planeVertex.a_position,
                time : time,
                mousePos : [clipPos.x, clipPos.y],
                isMouseEnable: this.mouseAnimation.TouchVisibility,
                textureLerpValue: this.maskHighlight.LerpValue,
            });

            //this.textAnimation.OnUpdate(time);
            this.mouseAnimation.OnUpdate(time);
            this.maskHighlight.OnUpdate(time, this._FrontTexA, this._HighlightTexA, this._FrontTexB, this._HighlightTexB);

            this.time = time;
        });
    }

    //Resize texture to its aspect ratio
    private UpdatePlaneVertex() {
        if (this._FrontTexA == null) return;
        
        let currentAspectRatio = this._webglDom.width / this._webglDom.height;
        let originalAspectRatio = this._FrontTexA.width / this._FrontTexA.height;
        let aspectRatio = originalAspectRatio / currentAspectRatio;

        this._planeVertex = this.webglUtility.ApplyAspectRatioToPlane(this.webglUtility.GetPlaneVertex(), aspectRatio);
    }

    protected AutoSetCanvasSize() {
        super.AutoSetCanvasSize();
        this.UpdatePlaneVertex();
    }

    //#region Event
    private OnMouseMoveEvent(e: any) {
        this.maskHighlight.OnMouseMoveEvent(e.mousePosition.x, e.mousePosition.y);

        let mouseOffset = 40;
        this.mouseAnimation.OnMouseMoveEvent(e.mousePosition.x + mouseOffset, this._webglDom.clientHeight - e.mousePosition.y + mouseOffset); //Css Y pos offset
    }

    private OnMouseDownEvent(e: any) {
        this.mouseAnimation.OnMouseDownEvent();
    }

    private OnMouseUpEvent(e: any) {
        this.mouseAnimation.OnMouseUpEvent(this.time);
    }
    //#endregion
}

export default ProjectE;