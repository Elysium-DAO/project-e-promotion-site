import {NormalizeByRange, Clamp} from '../../Utility/UtilityMethod';

export default class MouseAnimation {

    private _rotation_speed : number;
    private _svgDom : HTMLElement;
    private _svgImageDom : HTMLImageElement;

    public TouchVisibility = 0;
    private _touchVisibilityFadeTime = 2;
    private _touchVisibilityRecordTime = 0;
    private _isMobileDevice : boolean = false;

    constructor(query: string, rotation_speed: number, isMobileDevice : boolean) {
        this._svgDom = document.querySelector(query);
        this._svgImageDom = document.querySelector(query + " > img");
        this._rotation_speed = rotation_speed;
        this._isMobileDevice = isMobileDevice;

        this.TouchVisibility = (!isMobileDevice) ? 1 : 0;
    }

    public OnUpdate(time: number) {
        if (!this._isMobileDevice)
            this._svgImageDom.style.transform = `rotate(${ time * this._rotation_speed }rad)`;

        if (this._isMobileDevice && this._touchVisibilityRecordTime > 0) {
            this.TouchVisibility = 1 - NormalizeByRange(
                time, 
                this._touchVisibilityRecordTime - this._touchVisibilityFadeTime, 
                this._touchVisibilityRecordTime
            );
        }
    }

    public OnMouseMoveEvent(screen_x: number, screen_y: number) {
        if (!this._isMobileDevice)
            this._svgDom.style.transform = `translate(${screen_x}px, ${screen_y}px)`;   
            
    }

    public OnMouseDownEvent() {
        this.TouchVisibility = 1;
        this._touchVisibilityRecordTime = 0;
    }

    public OnMouseUpEvent(time:number) {
        this.TouchVisibility = 1;
        this._touchVisibilityRecordTime = time + this._touchVisibilityFadeTime;
    }
}