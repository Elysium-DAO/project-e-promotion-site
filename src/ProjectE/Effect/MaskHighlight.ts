import {MaskTextureType, ProjectEConfig, InputInteractionType} from '../ProjectEType';
import {IsMobileDevice, GetImagePromise, NormalizeByRange, Lerp, Clamp} from '../../Utility/UtilityMethod';
import REGL, { Framebuffer,Regl } from 'regl';

export class MaskHighLight {

    currentIndex = 0;
    rotateCount = 0;

    _front_textures : HTMLImageElement[];
    _highlight_textures : HTMLImageElement[];
    _noise_texture : HTMLImageElement;
    _config: ProjectEConfig;
    
    inputInteractionType : InputInteractionType;
    maskTexType : MaskTextureType;

    IsMobileDevice = false;

    private _recordTexRotTime: number;
    public Identifier : number = 0;
    public LerpValue : number = 0;


    constructor(webgl:HTMLCanvasElement, config: ProjectEConfig) {
        this._config = config;
        this.IsMobileDevice = IsMobileDevice();
        //this.IsMobileDevice = true;
        this._recordTexRotTime = this._config.texture_rotation_time;

        this.inputInteractionType = {
            mouse_screenpos_x :0,
            mouse_screenpos_y : 0,
            input_enable: (!this.IsMobileDevice)
        }

        // console.log("Is Mobile Device "+ this.IsMobileDevice);
    }

    public async CacheMaskTexture() {
        this.maskTexType = (this.IsMobileDevice) ? this._config.mobile_textures : this._config.desktop_textures;

        this._noise_texture = await GetImagePromise(this._config.noise_tex_path);

        this._front_textures = [];
        this._highlight_textures = [];

        for (let i = 0; i < this.maskTexType.count; i++) {
            this._front_textures.push(await GetImagePromise(this.maskTexType.front_textures[i]));
            this._highlight_textures.push(await GetImagePromise(this.maskTexType.highlight_textures[i])); 
        }
    }

    public GetCurrentPairTexture() : [HTMLImageElement, HTMLImageElement]{
        return [this._front_textures[this.currentIndex], this._highlight_textures[this.currentIndex] ];
    }

    public GetPairTexture(index : number) : [HTMLImageElement, HTMLImageElement] {
        if (index >= this.maskTexType.count) return null;
        
        return [this._front_textures[index], this._highlight_textures[index] ];
    }

    public IncrementIndex() : number {
        this.rotateCount++;
        return this.currentIndex = (this.currentIndex + 1) % this.maskTexType.count;
    }

    public OnUpdate(time: number, frontTexA : REGL.Texture2D, highlightTexA: REGL.Texture2D, 
        frontTexB : REGL.Texture2D, highlightTexB: REGL.Texture2D) {

        //Only mobile device need transition animation effect
        if (!this.IsMobileDevice) {
            return;
        }

        if (time < this._recordTexRotTime) {
            //By pass the first rotation
            if (this.rotateCount == 0) {
                this.LerpValue = 1;
                return;
            }
            this.LerpValue = Clamp(
                NormalizeByRange(time, this._recordTexRotTime - this._config.texture_rotation_time, this._recordTexRotTime - this._config.texture_transition_time), 
                0, 1);

            if (this.Identifier == 1)
                this.LerpValue = 1 - this.LerpValue;   
            
            return;
        }

        this._recordTexRotTime = time + this._config.texture_rotation_time;

        let currentIndex = this.IncrementIndex();
        let currentTextureSet = this.GetPairTexture(currentIndex);

        this.Identifier = this.rotateCount % 2;

        // console.log(`identifier ${this._identifier}, index ${currentIndex}, rotation ${this.maskHighlight.rotateCount}`);

        if (this.Identifier == 0) {
            frontTexB.subimage(currentTextureSet[0]);
            highlightTexB.subimage(currentTextureSet[1]);
            return;
        }

        if (this.Identifier == 1) {
            frontTexA.subimage(currentTextureSet[0]);
            highlightTexA.subimage(currentTextureSet[1]);
            return;
        }
    }


    //#region Input Event
    public OnMouseMoveEvent(screen_x: number, screen_y: number) {
        this.inputInteractionType.mouse_screenpos_x = screen_x;
        this.inputInteractionType.mouse_screenpos_y = screen_y;
    }
    //#endregion
}