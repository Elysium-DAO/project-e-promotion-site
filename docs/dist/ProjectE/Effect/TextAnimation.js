export default class TextAnimation {
  constructor(query, baseText, increment, speed, maxTime) {
    this.currentTime = 0;
    this._textDom = document.querySelector(query);
    this._baseText = baseText;
    this._increment = increment;
    this._speed = speed;
    this._maxTime = maxTime;
  }
  OnUpdate(time) {
    let intervalCount = Math.floor(time * this._speed % this._maxTime);
    if (intervalCount == this.currentTime)
      return;
    this.currentTime = intervalCount;
    let displayText = this._baseText;
    for (let i = 0; i < intervalCount; i++)
      displayText += this._increment;
    this._textDom.innerText = displayText;
  }
}
