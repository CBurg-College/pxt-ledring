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

    export function setPixel(offset: number, red: number, green: number, blue: number): void {
        offset *= 3
        _buffer[offset + 0] = green;
        _buffer[offset + 1] = red;
        _buffer[offset + 2] = blue;
    }

    export function setPixelRGB(pixel: number, rgb: number): void {
        if (pixel < 0 || pixel >= 8)
            return;
        let red = (rgb >> 16) & 0xFF;
        let green = (rgb >> 8) & 0xFF;
        let blue = (rgb) & 0xFF;
        setPixel(pixel, red, green, blue)
    }

    export function setRing(red: number, green: number, blue: number) {
        for (let i = 0; i < 8; ++i)
            setPixel(i, red, green, blue)
    }

    export function setRingRGB(rgb: number) {
        let red = (rgb >> 16) & 0xFF;
        let green = (rgb >> 8) & 0xFF;
        let blue = (rgb) & 0xFF;
        for (let i = 0; i < 8; ++i)
            setPixel(i, red, green, blue)
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
            setPixelRGB(0, rgb(Color.Red))
            setPixelRGB(1, rgb(Color.Orange))
            setPixelRGB(2, rgb(Color.Yellow))
            setPixelRGB(3, rgb(Color.Green))
            setPixelRGB(4, rgb(Color.Blue))
            setPixelRGB(5, rgb(Color.Indigo))
            setPixelRGB(6, rgb(Color.Violet))
            setPixelRGB(7, rgb(Color.Purple))
        }
        else {
            setPixelRGB(7, rgb(Color.Red))
            setPixelRGB(6, rgb(Color.Orange))
            setPixelRGB(5, rgb(Color.Yellow))
            setPixelRGB(4, rgb(Color.Green))
            setPixelRGB(3, rgb(Color.Blue))
            setPixelRGB(2, rgb(Color.Indigo))
            setPixelRGB(1, rgb(Color.Violet))
            setPixelRGB(0, rgb(Color.Purple))
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
                setPixel(7 - i, red, green, blue)
            else
                setPixel(i, red, green, blue)
            showBuffer()
            basic.pause(_pace)
        }
        showBuffer()
        for (let i = 6; i >= 0; i--) {
            if (dir == Rotation.Clockwise)
                setPixel(7 - i, 0, 0, 0)
            else
                setPixel(i, 0, 0, 0)
            showBuffer()
            basic.pause(_pace)
        }
        if (dir == Rotation.Clockwise)
            setPixel(0, 0, 0, 0)
        else
            setPixel(7, 0, 0, 0)
        showBuffer()
    }
}
