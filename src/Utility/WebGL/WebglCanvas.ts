
import REGL, {Regl} from 'regl';
import {IntVector2} from '../UniversalType';

const reglPromise = import('regl');

abstract class WebglCanvas {
    protected _webglDom : HTMLCanvasElement;
    protected _reglContext : Regl;

    private maxDrawBufferSize = 2048;
    public IsProgramValid : boolean = false;

    constructor(webglQuery : string) {
        this._webglDom = document.querySelector(webglQuery);

        this.IsProgramValid = this._webglDom != null;

        if (this.IsProgramValid) {
            this.RegisterDomEvent();    
            this.AutoSetCanvasSize();
        }
    }

    protected RegisterDomEvent() {
        window.addEventListener('resize', () => {
            this.AutoSetCanvasSize();
        });
    }

    protected async CreatREGLCanvas(webglDom : HTMLCanvasElement) {
        let regl = await reglPromise;

        return regl.default({
            canvas : webglDom
            //attributes : {preserveDrawingBuffer : true}
        });
    }

    protected AutoSetCanvasSize() {
        this.SetCanvasToSceenSize(this._webglDom.clientWidth, this._webglDom.clientHeight);
    }

    private SetCanvasToSceenSize(displayWidth : number, displayHeight : number) {
        //Set default to 2k resolution, if user has high spec digital screen
  
        if (displayWidth > this.maxDrawBufferSize || displayHeight > this.maxDrawBufferSize) {
          displayHeight = (displayHeight > displayWidth) ? this.maxDrawBufferSize : (this.maxDrawBufferSize * displayHeight / displayWidth);
          displayWidth = (displayWidth >= displayHeight) ? this.maxDrawBufferSize : (this.maxDrawBufferSize * displayWidth / displayHeight);
        }
  
        //console.log(displayWidth +", " + displayHeight);
  
        this._webglDom.width = displayWidth;
        this._webglDom.height = displayHeight;
    }

    // Clip position is -1 to +1
    public ScreenPositionToClipSpace(x : number, y : number) : IntVector2{
        let scaleX = (x / this._webglDom.clientWidth) * 2 - 1;
        let scaleY = (y / this._webglDom.clientHeight) * 2 - 1;

    
        return {x : scaleX, y: scaleY};    
    }

    public ClipSpaceToScreenPosition(x : number, y : number) : IntVector2{
        let scaleX = (x + 1 * 0.5) * this._webglDom.clientWidth;
        let scaleY = (y + 1 * 0.5 ) * this._webglDom.clientHeight;

        return {x : scaleX, y: scaleY};    
    }

    //Don't read this in update loop
    public ReadPixel(x : number, y : number) : number[] {
        return Array.from( this._reglContext.read({
            x: x,
            y: y,
            width: 1,
            height: 1,
            data: new Uint8Array(4)
        })).map(x=> x / 255);
    }
}

export default WebglCanvas;