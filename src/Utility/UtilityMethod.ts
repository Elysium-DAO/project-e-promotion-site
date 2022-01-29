import {IntVector2} from './UniversalType';

export function Lerp(x : number, y : number, t : number) {
    return x + (t * (y - x));
}

export function NormalizeByRange(target : number, min : number, max : number) {
    return (target - min) / (max - min);
}

export function RandomRange(min : number, max : number) {
    return ~~(Math.random() * (max - min + 1)) + min
};

export function Normalize2D(vector : IntVector2) : IntVector2 {
    let vi = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
    let normalized : IntVector2 ={
        x : vector.x / vi,
        y : vector.y / vi
    }

    return normalized;
}

export function VectorNumAdd(vector : IntVector2, scale : number) {
    return {
        x : vector.x + scale,
        y : vector.y + scale
    };
}

export function VectorNumScale(vector : IntVector2, scale : number) {
    return {
        x :vector.x * scale,
        y : vector.y * scale
    };
}

export function VectorDistance(a : IntVector2, b : IntVector2) {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

export function VectorMaginitude(a : IntVector2) {
    return Math.sqrt(Math.pow(a.x, 2) + Math.pow( a.y, 2));
}

export function VectorAdd(a : IntVector2, b : IntVector2) {
    return {
        x : a.x + b.x,
        y : a.y + b.y
    }
}

export function VectorMinus(a : IntVector2, b : IntVector2) {
    return {
        x : a.x - b.x,
        y : a.y - b.y
    }
}

export function VectorToArray(v :IntVector2 ) : number[] {
    return [v.x, v.y];
}

export function ArrayToVector(array : number[] ) : IntVector2 {    
    return {x : array[0], y : array[1]};
}

export function Clamp(value : number, min : number, max : number) {
    return Math.min(Math.max(value, min), max);
  };
  

export function GetImagePromise(imagePath : string) {
    return new Promise<HTMLImageElement>( resolve => {
        const im = new Image();
        im.crossOrigin = "anonymous";
        im.src = imagePath;
        im.onload = () => resolve(Object.assign(im));

        return im;
    });
}

export function GetImageOnTheFly(imagePath : string, oncompleteCallback : () => void) {

    const im = new Image();
    im.crossOrigin = "anonymous";
    im.src = imagePath;

    im.onload = () => {
        oncompleteCallback();
    };
    return im;
}

export function GetRelativeURL(url : string) {
    return (url.replace(/^(?:\/\/|[^/]+)*\//, ''));
}

export function StringToVector(vectorString : string) : IntVector2 {
    let splits = vectorString.split(",");
    return {
        x : parseFloat(splits[0]),
        y : parseFloat(splits[1])
    };
}

export function RoundToDecimal(value : number, decimal : number) {
    let d = Math.pow(10, decimal);
    return Math.round(value * d) / d;
}

export function IsMobileDevice(): boolean {
    var ua = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod/i.test(ua);
}