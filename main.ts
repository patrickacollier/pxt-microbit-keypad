/**
 * Keypad extension for micro:bit
 * Based on Arduino Keypad library functionality
 */

//% weight=100 color=#0fbc11 icon="\uf11c"
namespace keypad {
    
    export enum KeyState {
        //% block="pressed"
        PRESSED,
        //% block="released"
        RELEASED,
        //% block="held"
        HELD,
        //% block="idle"
        IDLE
    }

    let rowPins: DigitalPin[] = [];
    let colPins: DigitalPin[] = [];
    let keymap: string[][] = [];
    let keys: KeypadKey[] = [];
    let debounceTime = 10;
    let holdTime = 1000;
    let lastScanTime = 0;

    class KeypadKey {
        public kchar: string;
        public kstate: KeyState;
        public stateChanged: boolean;
        public row: number;
        public col: number;
        private startTime: number;

        constructor(char: string, row: number, col: number) {
            this.kchar = char;
            this.kstate = KeyState.IDLE;
            this.stateChanged = false;
            this.row = row;
            this.col = col;
            this.startTime = 0;
        }

        public updateState(pressed: boolean): void {
            let currentTime = input.runningTime();
            
            if (pressed) {
                if (this.kstate == KeyState.IDLE) {
                    this.kstate = KeyState.PRESSED;
                    this.stateChanged = true;
                    this.startTime = currentTime;
                } else if (this.kstate == KeyState.PRESSED && 
                          (currentTime - this.startTime) > holdTime) {
                    this.kstate = KeyState.HELD;
                    this.stateChanged = true;
                } else {
                    this.stateChanged = false;
                }
            } else {
                if (this.kstate != KeyState.IDLE) {
                    this.kstate = KeyState.RELEASED;
                    this.stateChanged = true;
                } else {
                    this.stateChanged = false;
                }
            }
        }

        public resetState(): void {
            if (this.kstate == KeyState.RELEASED) {
                this.kstate = KeyState.IDLE;
                this.stateChanged = false;
            }
        }
    }

    /**
     * Initialize a 4x4 keypad with default phone keypad layout
     * @param r0 row 0 pin
     * @param r1 row 1 pin  
     * @param r2 row 2 pin
     * @param r3 row 3 pin
     * @param c0 column 0 pin
     * @param c1 column 1 pin
     * @param c2 column 2 pin
     * @param c3 column 3 pin
     */
    //% blockId=keypad_init_4x4 block="initialize 4x4 keypad|rows %r0 %r1 %r2 %r3|cols %c0 %c1 %c2 %c3"
    //% weight=100
    export function init4x4Keypad(
        r0: DigitalPin, r1: DigitalPin, r2: DigitalPin, r3: DigitalPin,
        c0: DigitalPin, c1: DigitalPin, c2: DigitalPin, c3: DigitalPin
    ): void {
        rowPins = [r0, r1, r2, r3];
        colPins = [c0, c1, c2, c3];
        
        // Default 4x4 keypad layout (phone style)
        keymap = [
            ['1', '2', '3', 'A'],
            ['4', '5', '6', 'B'],
            ['7', '8', '9', 'C'],
            ['*', '0', '#', 'D']
        ];
        
        initializeKeys();
        setupPins();
    }

    /**
     * Initialize a 3x4 keypad with phone keypad layout
     * @param r0 row 0 pin
     * @param r1 row 1 pin  
     * @param r2 row 2 pin
     * @param r3 row 3 pin
     * @param c0 column 0 pin
     * @param c1 column 1 pin
     * @param c2 column 2 pin
     */
    //% blockId=keypad_init_3x4 block="initialize 3x4 keypad|rows %r0 %r1 %r2 %r3|cols %c0 %c1 %c2"
    //% weight=95
    export function init3x4Keypad(
        r0: DigitalPin, r1: DigitalPin, r2: DigitalPin, r3: DigitalPin,
        c0: DigitalPin, c1: DigitalPin, c2: DigitalPin
    ): void {
        rowPins = [r0, r1, r2, r3];
        colPins = [c0, c1, c2];
        
        // Default 3x4 keypad layout (phone style)
        keymap = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['*', '0', '#']
        ];
        
        initializeKeys();
        setupPins();
    }

    /**
     * Get the currently pressed key
     * @returns the character of the pressed key, or empty string if none
     */
    //% blockId=keypad_get_key block="get pressed key"
    //% weight=90
    export function getKey(): string {
        scanKeys();
        
        for (let key of keys) {
            if (key.kstate == KeyState.PRESSED && key.stateChanged) {
                key.stateChanged = false;
                return key.kchar;
            }
        }
        return "";
    }

    /**
     * Check if a specific key is currently pressed
     * @param keyChar the character to check
     */
    //% blockId=keypad_is_pressed block="is key %keyChar pressed"
    //% weight=85
    export function isPressed(keyChar: string): boolean {
        scanKeys();
        
        for (let key of keys) {
            if (key.kchar == keyChar) {
                return key.kstate == KeyState.PRESSED || key.kstate == KeyState.HELD;
            }
        }
        return false;
    }

    /**
     * Wait for a key to be pressed and return it
     * @returns the character of the pressed key
     */
    //% blockId=keypad_wait_for_key block="wait for key press"
    //% weight=80
    export function waitForKey(): string {
        let key = "";
        while (key == "") {
            key = getKey();
            basic.pause(10);
        }
        return key;
    }

    /**
     * Set debounce time in milliseconds
     * @param time debounce time in ms
     */
    //% blockId=keypad_set_debounce block="set debounce time %time ms"
    //% weight=70
    //% time.min=1 time.max=100
    export function setDebounceTime(time: number): void {
        debounceTime = time;
    }

    /**
     * Set hold time in milliseconds  
     * @param time hold time in ms
     */
    //% blockId=keypad_set_hold_time block="set hold time %time ms"
    //% weight=65
    //% time.min=100 time.max=5000
    export function setHoldTime(time: number): void {
        holdTime = time;
    }

    /**
     * Get the state of a specific key
     * @param keyChar the character to check
     */
    //% blockId=keypad_get_key_state block="state of key %keyChar"
    //% weight=60
    export function getKeyState(keyChar: string): KeyState {
        scanKeys();
        
        for (let key of keys) {
            if (key.kchar == keyChar) {
                return key.kstate;
            }
        }
        return KeyState.IDLE;
    }

    function initializeKeys(): void {
        keys = [];
        for (let row = 0; row < keymap.length; row++) {
            for (let col = 0; col < keymap[row].length; col++) {
                keys.push(new KeypadKey(keymap[row][col], row, col));
            }
        }
    }

    function setupPins(): void {
        // Set all row pins as outputs, initially high
        for (let pin of rowPins) {
            pins.digitalWritePin(pin, 1);
        }
        
        // Set all column pins as inputs with pull-up
        for (let pin of colPins) {
            pins.setPull(pin, PinPullMode.PullUp);
        }
    }

    function scanKeys(): void {
        let currentTime = input.runningTime();
        
        // Simple debouncing
        if (currentTime - lastScanTime < debounceTime) {
            return;
        }
        lastScanTime = currentTime;

        // Scan each row
        for (let row = 0; row < rowPins.length; row++) {
            // Set current row low, others high
            for (let r = 0; r < rowPins.length; r++) {
                pins.digitalWritePin(rowPins[r], r == row ? 0 : 1);
            }
            
            // Small delay for pin settling
            control.waitMicros(10);
            
            // Check each column
            for (let col = 0; col < colPins.length; col++) {
                let pressed = pins.digitalReadPin(colPins[col]) == 0;
                
                // Find the corresponding key
                for (let key of keys) {
                    if (key.row == row && key.col == col) {
                        key.updateState(pressed);
                        break;
                    }
                }
            }
        }
        
        // Reset all row pins to high
        for (let pin of rowPins) {
            pins.digitalWritePin(pin, 1);
        }
        
        // Reset released keys to idle
        for (let key of keys) {
            key.resetState();
        }
    }
}