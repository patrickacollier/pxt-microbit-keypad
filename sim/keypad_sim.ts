namespace pxsim.keypad {
    // Key state enum matching the main.ts
    export enum KeyState {
        PRESSED = 0,
        RELEASED = 1,
        HELD = 2,
        IDLE = 3
    }

    // Global state for the keypad simulation
    let keypadState = {
        initialized: false,
        keymap: [] as string[][],
        pressedKeys: new Set<string>(),
        keyStates: {} as { [key: string]: { state: KeyState; startTime: number; } },
        debounceTime: 10,
        holdTime: 1000,
        rowPins: [] as number[],
        colPins: [] as number[],
        element: null as any
    };

    export function init4x4Keypad(
        r0: number, r1: number, r2: number, r3: number,
        c0: number, c1: number, c2: number, c3: number
    ): void {
        keypadState.rowPins = [r0, r1, r2, r3];
        keypadState.colPins = [c0, c1, c2, c3];
        keypadState.keymap = [
            ['1', '2', '3', 'A'],
            ['4', '5', '6', 'B'],
            ['7', '8', '9', 'C'],
            ['*', '0', '#', 'D']
        ];
        
        initializeKeypadState();
        updateSimulatorView();
    }

    export function init3x4Keypad(
        r0: number, r1: number, r2: number, r3: number,
        c0: number, c1: number, c2: number
    ): void {
        keypadState.rowPins = [r0, r1, r2, r3];
        keypadState.colPins = [c0, c1, c2];
        keypadState.keymap = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['*', '0', '#']
        ];
        
        initializeKeypadState();
        updateSimulatorView();
    }

    function initializeKeypadState(): void {
        keypadState.initialized = true;
        keypadState.pressedKeys.clear();
        keypadState.keyStates = {};
        
        // Initialize key states
        for (let row = 0; row < keypadState.keymap.length; row++) {
            for (let col = 0; col < keypadState.keymap[row].length; col++) {
                const key = keypadState.keymap[row][col];
                keypadState.keyStates[key] = {
                    state: KeyState.IDLE,
                    startTime: 0
                };
            }
        }
    }

    function updateSimulatorView(): void {
        // Update the simulator display - PXT handles the DOM integration
        console.log(`Keypad initialized: ${keypadState.keymap[0].length}x${keypadState.keymap.length}`);
        
        // In a real PXT simulator, this would integrate with the board view
        // For now, we provide console-based feedback and state management
        if (keypadState.initialized) {
            console.log('Keypad layout:');
            for (let row = 0; row < keypadState.keymap.length; row++) {
                console.log(keypadState.keymap[row].join(' '));
            }
        }
    }

    export function getKey(): string {
        scanKeys();
        
        // Return first pressed key found
        const pressedKeysArray = Array.from(keypadState.pressedKeys);
        for (let i = 0; i < pressedKeysArray.length; i++) {
            const key = pressedKeysArray[i];
            const keyStateData = keypadState.keyStates[key];
            if (keyStateData && keyStateData.state === KeyState.PRESSED) {
                // Mark as processed by changing state
                keyStateData.state = KeyState.HELD;
                return key;
            }
        }
        return "";
    }

    export function isPressed(keyChar: string): boolean {
        scanKeys();
        const keyStateData = keypadState.keyStates[keyChar];
        if (!keyStateData) return false;
        return keyStateData.state === KeyState.PRESSED || keyStateData.state === KeyState.HELD;
    }

    export function waitForKey(): string {
        // In simulation, just return the current pressed key
        return getKey();
    }

    export function setDebounceTime(time: number): void {
        keypadState.debounceTime = time;
    }

    export function setHoldTime(time: number): void {
        keypadState.holdTime = time;
    }

    export function getKeyState(keyChar: string): number {
        scanKeys();
        const keyStateData = keypadState.keyStates[keyChar];
        return keyStateData ? keyStateData.state : KeyState.IDLE;
    }

    function scanKeys(): void {
        if (!keypadState.initialized) return;

        const currentTime = Date.now(); // Use standard Date.now() instead of pxsim.U.now()
        
        // Update key states based on pressed keys
        for (let row = 0; row < keypadState.keymap.length; row++) {
            for (let col = 0; col < keypadState.keymap[row].length; col++) {
                const key = keypadState.keymap[row][col];
                const keyStateData = keypadState.keyStates[key];
                const isPressed = keypadState.pressedKeys.has(key);
                
                if (isPressed) {
                    if (keyStateData.state === KeyState.IDLE) {
                        keyStateData.state = KeyState.PRESSED;
                        keyStateData.startTime = currentTime;
                    } else if (keyStateData.state === KeyState.PRESSED && 
                             (currentTime - keyStateData.startTime) > keypadState.holdTime) {
                        keyStateData.state = KeyState.HELD;
                    }
                } else {
                    if (keyStateData.state !== KeyState.IDLE) {
                        keyStateData.state = KeyState.RELEASED;
                        // Auto-reset to idle after a brief moment
                        setTimeout(() => {
                            if (keyStateData.state === KeyState.RELEASED) {
                                keyStateData.state = KeyState.IDLE;
                            }
                        }, keypadState.debounceTime);
                    }
                }
                
                // Simulate pin behavior for scanning
                simulateKeyPress(row, col, isPressed);
            }
        }
    }

    function simulateKeyPress(row: number, col: number, isPressed: boolean): void {
        // Simulate the keypad matrix behavior by affecting pin states
        // In a full implementation, this would interact with the pin simulation
        // For now, we'll just track the state internally
        if (isPressed && row < keypadState.rowPins.length && col < keypadState.colPins.length) {
            // This would normally interact with the board simulation
            // but we'll keep it simple for now
        }
    }

    // Simulator helper functions for key interaction
    export function simulateKeyDown(key: string): void {
        keypadState.pressedKeys.add(key);
        console.log(`🔽 Key pressed: ${key}`);
        updateKeyVisualState(key, true);
    }

    export function simulateKeyUp(key: string): void {
        keypadState.pressedKeys.delete(key);
        console.log(`🔼 Key released: ${key}`);
        updateKeyVisualState(key, false);
    }

    function updateKeyVisualState(key: string, pressed: boolean): void {
        // This would update the visual state in a full PXT simulator
        // For now, we track it in state
        if (pressed) {
            console.log(`   └─ Key ${key} is now active`);
        } else {
            console.log(`   └─ Key ${key} is now inactive`);
        }
    }

    // Function to check if keypad is initialized
    export function isInitialized(): boolean {
        return keypadState.initialized;
    }

    // Function to get current keymap for display
    export function getKeymap(): string[][] {
        return keypadState.keymap;
    }
}
