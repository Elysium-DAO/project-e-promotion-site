import {MaskTextureType, ProjectEConfig, InputInteractionType} from '../ProjectEType';
import {IsMobileDevice, GetImagePromise} from '../../Utility/UtilityMethod';
import InputHandler, {InputState} from '../../Utility/Input/CanvasInputHandler';
import EventSystem from '../../Utility/EventSystem';
import {CustomEventTypes, IntVector2 } from '../../Utility/UniversalType';

export class MaskHighLight {

    currentIndex = 0;
    rotateCount = 0;

    _front_textures : HTMLImageElement[];
    _highlight_textures : HTMLImageElement[];
    _noise_texture : HTMLImageElement;
    _isMobileDevice = false;
    _config: ProjectEConfig;
    
    inputInteractionType : InputInteractionType;
    maskTexType : MaskTextureType;

    constructor(webgl:HTMLCanvasElement, config: ProjectEConfig) {
        this._config = config;


        this._isMobileDevice = IsMobileDevice();

        //this._isMobileDevice = true;

        this.inputInteractionType = {
            mouse_screenpos_x :0,
            mouse_screenpos_y : 0,
            input_enable: (!this._isMobileDevice)
        }

        console.log("Is Mobile Device "+ this._isMobileDevice);
    }

    public async CacheMaskTexture() {
        this.maskTexType = (this._isMobileDevice) ? this._config.mobile_textures : this._config.desktop_textures;

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

    public OnUpdate(time: number) {


    }

    //#region Input Event
    public OnMouseMoveEvent(screen_x: number, screen_y: number) {
        this.inputInteractionType.mouse_screenpos_x = screen_x;
        this.inputInteractionType.mouse_screenpos_y = screen_y;
    }
    //#endregion
}