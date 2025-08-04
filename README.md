# Keypad Extension for micro:bit

This extension provides support for matrix keypads (3x4 and 4x4) on the micro:bit, converted from the popular Arduino Keypad library.

## Features

- Support for 3x4 and 4x4 matrix keypads
- Key press detection with debouncing
- Key hold detection
- Multiple key states: pressed, released, held, idle
- Configurable debounce and hold times
- Easy-to-use blocks for MakeCode

## Usage

### Basic Setup

1. **Initialize a 4x4 keypad:**
   ```blocks
   keypad.init4x4Keypad(DigitalPin.P0, DigitalPin.P1, DigitalPin.P2, DigitalPin.P8, DigitalPin.P16, DigitalPin.P13, DigitalPin.P14, DigitalPin.P15)
   ```

2. **Initialize a 3x4 keypad:**
   ```blocks
   keypad.init3x4Keypad(DigitalPin.P0, DigitalPin.P1, DigitalPin.P2, DigitalPin.P8, DigitalPin.P16, DigitalPin.P13, DigitalPin.P14)
   ```

### Reading Keys

1. **Get a pressed key:**
   ```blocks
   let key = keypad.getKey()
   if (key != "") {
       basic.showString(key)
   }
   ```

2. **Wait for any key press:**
   ```blocks
   let key = keypad.waitForKey()
   basic.showString(key)
   ```

3. **Check if specific key is pressed:**
   ```blocks
   if (keypad.isPressed("1")) {
       basic.showIcon(IconNames.Yes)
   }
   ```

### Pin Connections

For a 4x4 keypad:
- **Rows:** Connect to pins P0, P1, P2, P8
- **Columns:** Connect to pins P16, P13, P14, P15

For a 3x4 keypad:
- **Rows:** Connect to pins P0, P1, P2, P8  
- **Columns:** Connect to pins P16, P13, P14

**Note:** Avoid using pins that are reserved for the LED matrix (pins 3-7, 9-12) or other built-in features.

### Key Layout

**4x4 Keypad (default):**
```
1 2 3 A
4 5 6 B  
7 8 9 C
* 0 # D
```

**3x4 Keypad (default):**
```
1 2 3
4 5 6
7 8 9
* 0 #
```

## Advanced Features

### Debouncing
Set custom debounce time (default: 10ms):
```blocks
keypad.setDebounceTime(20)
```

### Hold Detection
Set custom hold time (default: 1000ms):
```blocks
keypad.setHoldTime(2000)
```

### Key States
Check the state of any key:
```blocks
if (keypad.getKeyState("5") == keypad.KeyState.HELD) {
    basic.showIcon(IconNames.Heart)
}
```

## Hardware Requirements

- micro:bit v1 or v2
- 3x4 or 4x4 matrix keypad
- Jumper wires for connections

## License

MIT License - converted from the Arduino Keypad library by Chris--A

## Supported targets

- for PXT/microbit