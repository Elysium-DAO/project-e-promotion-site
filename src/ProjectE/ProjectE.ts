import WebGLCanvas from '../Utility/WebGL/WebglCanvas';
import WebglUtility from '../Utility/WebGL/WebglUtility';
import {ProjectEConfig} from './ProjectEType';
import REGL, {Framebuffer, Framebuffer2D, Regl, Texture2D} from 'regl';
import {CreateCanvasREGLCommand, CreateFrameBufferCommand, CustomReglPropType, ExecuteREGLCommand} from './ProjectERegl';
import CanvasInputHandler from '../Utility/Input/CanvasInputHandler';
import EventSystem from '../Utility/EventSystem';
import {NormalizeByRange, Lerp, Clamp, GetImagePromise} from '../Utility/UtilityMethod';

import TextAnimation from './Effect/TextAnimation';
import MouseAnimation from './Effect/MouseAnimation';
import { MaskHighLight } from './Effect/MaskHighlight';
import { PlaneVertex, CustomEventTypes } from '../Utility/UniversalType';

class ProjectE extends WebGLCanvas{
    webglUtility : WebglUtility;
    reglFrameBufferCommand : REGL.DrawCommand;
    reglCanvasCommand : REGL.DrawCommand;
    reglRecordEaseCommand : REGL.DrawCommand;

    reglFrame : REGL.Cancellable;
    mouseTrackFrameBuffer : Framebuffer2D;
    frameBufferTex : Texture2D;

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
    private _texAspectRatio = 1;
    private _screenAspectRatio = 1;

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

        //this.LoadGIFLoad();
        this.InitProcess(config);
    }

    async InitProcess(config: ProjectEConfig) {
        await this.maskHighlight.CacheMaskTexture();
        await this.SetupWebglPipeline(config);

        //Draw the image in first frame
        this.DrawREGLCavnas();
    }

    async SetupWebglPipeline(config: ProjectEConfig) {
        this._reglContext  = await this.CreatREGLCanvas (this._webglDom);        
        let maskMaterial = await this.webglUtility.PrepareREGLShader(config.vertex_path, config.mask_effect_frag_path);
        let easeMaterial = await this.webglUtility.PrepareREGLShader(config.vertex_path, config.ease_effect_frag_path);

        this.frameBufferTex = this._reglContext.texture({radius: 256});

        this.mouseTrackFrameBuffer = this._reglContext.framebuffer({
            radius: 256,
            depthStencil: false,
        });

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

        this.reglCanvasCommand  = await CreateCanvasREGLCommand(
            this._reglContext,
            this.mouseTrackFrameBuffer,
            maskMaterial.vertex_shader, 
            maskMaterial.fragment_shader,
            this.maskHighlight._noise_texture,
            this._FrontTexA, 
            this._HighlightTexA, 
            this._FrontTexB, 
            this._HighlightTexB, 
            this._planeVertex.a_uv, 
            this.maskHighlight.maskTexType.scale,
            this.maskHighlight.maskTexType.mask_min_reveal_range,
            (this.maskHighlight.IsMobileDevice) ? 1 : 0,
            this._planeVertex.count);

        this.reglFrameBufferCommand = await CreateFrameBufferCommand(
            this._reglContext,
            this.mouseTrackFrameBuffer,
            this.frameBufferTex,
            maskMaterial.vertex_shader, 
            easeMaterial.fragment_shader,
            this.maskHighlight._noise_texture,
            this._planeVertex.a_uv, 
            this.maskHighlight.maskTexType.scale,
            this.maskHighlight.maskTexType.mask_min_reveal_range,
            this._planeVertex.count);
    }

    DrawREGLCavnas() {
        let commandCommand : CustomReglPropType = {
            position : this._planeVertex.a_position,
            textureAspectRatio: this._texAspectRatio,
            screenAspectRatio: this._screenAspectRatio,
            time : 0,
            mousePos : [-1, -1],
            mainColor : [0,0,0],
            isMouseEnable: this.mouseAnimation.TouchVisibility,
            textureLerpValue: this.maskHighlight.LerpValue,
        }

        this._reglContext.frame(({time}) => {

            let clipPos = this.ScreenPositionToClipSpace(this.maskHighlight.inputInteractionType.mouse_screenpos_x, this.maskHighlight.inputInteractionType.mouse_screenpos_y);
            let self = this;

            // clear contents of the drawing buffer
            this._reglContext.clear({
                color: this._blackColor,
                depth: 1
            });

            commandCommand.position = this._planeVertex.a_position;
            commandCommand.time = time;
            commandCommand.mousePos = [clipPos.x, clipPos.y];
            commandCommand.isMouseEnable = this.mouseAnimation.TouchVisibility;
            commandCommand.textureLerpValue = this.maskHighlight.LerpValue;
            commandCommand.textureAspectRatio = this._texAspectRatio;
            commandCommand.screenAspectRatio = this._screenAspectRatio;

            if (this.maskHighlight.LoadComplete && commandCommand.mainColor[0] < 1)
                commandCommand.mainColor[0] += 0.01;

            if (!this.maskHighlight.IsMobileDevice) {
                self.mouseTrackFrameBuffer.use(function() {    
                    ExecuteREGLCommand(self._reglContext, self.reglFrameBufferCommand, commandCommand);
    
                    self.frameBufferTex({
                        width: 256,
                        height:256,
                        copy: true,
                        flipY: true
                    });
                });
            }

            //Draw to Canvas
            ExecuteREGLCommand(this._reglContext, this.reglCanvasCommand, commandCommand);

            //this.textAnimation.OnUpdate(time);
            this.mouseAnimation.OnUpdate(time);
            this.maskHighlight.OnUpdate(time, this._FrontTexA, this._HighlightTexA, this._FrontTexB, this._HighlightTexB);

            this.time = time;
        });
    }

    //Resize texture to its aspect ratio
    private UpdatePlaneVertex() {
        if (this._FrontTexA == null) return;
        
        this._screenAspectRatio = this._webglDom.width / this._webglDom.height;
        let originalAspectRatio = this._FrontTexA.width / this._FrontTexA.height;

        this._texAspectRatio = originalAspectRatio / this._screenAspectRatio;
        //console.log(`currentAspectRatio ${this._screenAspectRatio}, originalAspectRatio ${originalAspectRatio}, aspectRatio ${this._texAspectRatio} `);
        this._planeVertex = this.webglUtility.ApplyAspectRatioToPlane(this.webglUtility.GetPlaneVertex(), this._texAspectRatio);
    }

    protected AutoSetCanvasSize() {
        super.AutoSetCanvasSize();
        this.UpdatePlaneVertex();
    }

    private LoadGIFLoad() {
        let gifPath = "./image/Project_E_logo.gif";
        let logoDom : HTMLImageElement = document.querySelector(".logo_image");

        //let gif = await GetImagePromise(gifPath);
        logoDom.src = gifPath;
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