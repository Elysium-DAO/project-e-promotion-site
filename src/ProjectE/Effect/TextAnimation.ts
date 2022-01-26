export default class TextAnimation {
    
    private _textDom : HTMLParagraphElement;

    private _baseText : string;
    private _increment: string;
    private _speed : number;
    private _maxTime : number;

    private currentTime = 0; 
    constructor(query: string, baseText: string, increment: string, speed : number, maxTime: number) {
        this._textDom = document.querySelector(query);
        
        this._baseText = baseText;
        this._increment = increment;
        this._speed = speed;
        this._maxTime = maxTime;
    }

    OnUpdate(time: number) {
        let intervalCount = Math.floor( (time * this._speed) % this._maxTime);

        if (intervalCount == this.currentTime) return;
        this.currentTime = intervalCount;

        let displayText = this._baseText;
        for (let i = 0; i < intervalCount; i++)
            displayText += this._increment;

        this._textDom.innerText = displayText;
    }
    
}