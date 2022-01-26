export interface IntVector2 {
    x : number;
    y : number;
}

export interface StringVector2 {
    x : string;
    y : string;
}

export let CustomEventTypes = {
    MouseDownEvent : "event@mousedown",
    MouseDragEvent : "event@mouseDrag",
    MouseUpEvent : "event@mouseUp",
    MouseMoveEvent : "event@mouseMove",

    MouseCtrlClick : "event@clickclick",
    DeselectPolygonEvent : "event@polygonDeselect",
    OnColorEvent : "event@onColorChange"
}

export interface PlaneVertex {
    a_position : number[][] // Vector2
    a_uv: number[][],
    count : number
}