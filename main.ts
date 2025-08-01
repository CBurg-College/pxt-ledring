namespace LedRing {

    export enum Rotation {
        //% block="clockwise"
        //% block.loc.nl="rechtsom"
        Clockwise,
        //% block="anti-clockwise"
        //% block.loc.nl="linksom"
        AClockwise
    }

    export enum Pace {
        //% block="slow"
        //% block.loc.nl="laag"
        Slow = 100,
        //% block="normal"
        //% block.loc.nl="gewoon"
        Normal = 50,
        //% block="fast"
        //% block.loc.nl="hoog"
        Fast = 25
    }

    //% shim=light::sendWS2812Buffer
    declare function displaySendBuffer(buf: Buffer, pin: DigitalPin): void;

    let _buffer = pins.createBuffer(24); // 8 pixels of 3 byte (rgb)
    let _pin: DigitalPin
    let _pace = Pace.Normal

    export function init() {
        _pin = DigitalPin.P14;
        pins.digitalWritePin(_pin, 0);
    }

    export function showBuffer() {
        displaySendBuffer(_buffer, _pin);
    }

    export function setPixelRGB(offset: number, red: number, green: number, blue: number): void {
        offset *= 3
        _buffer[offset + 0] = green;
        _buffer[offset + 1] = red;
        _buffer[offset + 2] = blue;
    }

    export function setPixelColor(pixel: number, color: Color): void {
        if (pixel < 0 || pixel >= 8)
            return;
        let RGB = rgb(color)
        let red = (RGB >> 16) & 0xFF;
        let green = (RGB >> 8) & 0xFF;
        let blue = (RGB) & 0xFF;
        setPixelRGB(pixel, red, green, blue)
    }

    export function setRGB(red: number, green: number, blue: number) {
        for (let i = 0; i < 8; ++i)
            setPixelRGB(i, red, green, blue)
        displaySendBuffer(_buffer, _pin)
    }

    export function setColor(color: Color) {
        let RGB = rgb(color)
        let red = (RGB >> 16) & 0xFF;
        let green = (RGB >> 8) & 0xFF;
        let blue = (RGB) & 0xFF;
        for (let i = 0; i < 8; ++i)
            setPixelRGB(i, red, green, blue)
        displaySendBuffer(_buffer, _pin)
    }

    export function setClear(): void {
        _buffer.fill(0, 0, 24);
    }

    export function setPace(pace: Pace) {
        _pace = pace
    }

    export function getPace(): Pace {
        return _pace
    }

    export function rotate(rot: Rotation): void {
        if (rot == Rotation.Clockwise)
            _buffer.rotate(-3, 0, 24)
        else
            _buffer.rotate(3, 0, 24)
    }

    export function rainbow(rot: Rotation) {
        if (rot == Rotation.Clockwise) {
            setPixelColor(0, Color.Red)
            setPixelColor(1, Color.Orange)
            setPixelColor(2, Color.Yellow)
            setPixelColor(3, Color.Green)
            setPixelColor(4, Color.Blue)
            setPixelColor(5, Color.Indigo)
            setPixelColor(6, Color.Violet)
            setPixelColor(7, Color.Purple)
        }
        else {
            setPixelColor(7, Color.Red)
            setPixelColor(6, Color.Orange)
            setPixelColor(5, Color.Yellow)
            setPixelColor(4, Color.Green)
            setPixelColor(3, Color.Blue)
            setPixelColor(2, Color.Indigo)
            setPixelColor(1, Color.Violet)
            setPixelColor(0, Color.Purple)
        }
        showBuffer()
        basic.pause(_pace)
        for (let i = 0; i < 7; i++) {
            rotate(rot)
            showBuffer()
            basic.pause(_pace)
        }
    }

    export function snake(color: Color, dir: Rotation) {
        let col = rgb(color)
        let red = (col >> 16) & 0xFF;
        let green = (col >> 8) & 0xFF;
        let blue = (col) & 0xFF;
        setClear();
        showBuffer()
        for (let i = 7; i >= 0; i--) {
            if (dir == Rotation.Clockwise)
                setPixelRGB(7 - i, red, green, blue)
            else
                setPixelRGB(i, red, green, blue)
            showBuffer()
            basic.pause(_pace)
        }
        showBuffer()
        for (let i = 6; i >= 0; i--) {
            if (dir == Rotation.Clockwise)
                setPixelRGB(7 - i, 0, 0, 0)
            else
                setPixelRGB(i, 0, 0, 0)
            showBuffer()
            basic.pause(_pace)
        }
        if (dir == Rotation.Clockwise)
            setPixelRGB(0, 0, 0, 0)
        else
            setPixelRGB(7, 0, 0, 0)
        showBuffer()
    }
}
