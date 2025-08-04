// Test the keypad extension
keypad.init4x4Keypad(
    DigitalPin.P0, DigitalPin.P1, DigitalPin.P2, DigitalPin.P8,
    DigitalPin.P16, DigitalPin.P13, DigitalPin.P14, DigitalPin.P15
)

basic.forever(function () {
    let key = keypad.getKey()
    if (key != "") {
        basic.showString(key)
        basic.pause(500)
        basic.clearScreen()
    }
})