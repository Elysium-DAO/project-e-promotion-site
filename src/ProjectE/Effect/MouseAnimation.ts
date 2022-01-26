export default class MouseAnimation {

    private _rotation_speed : number;
    private _svgDom : HTMLElement;
    private _svgImageDom : HTMLImageElement;

    constructor(query: string, rotation_speed: number) {
        this._svgDom = document.querySelector(query);
        this._svgImageDom = document.querySelector(query + " > img");

        this._rotation_speed = rotation_speed;
    }

    public OnUpdate(time: number) {
        this._svgImageDom.style.transform = `rotate(${ time * this._rotation_speed }rad)`;
    }

    public OnMouseMoveEvent(screen_x: number, screen_y: number) {
        this._svgDom.style.transform = `translate(${screen_x}px, ${screen_y}px)`;        
    }
}