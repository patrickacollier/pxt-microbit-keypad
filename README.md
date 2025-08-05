# Keypad Extension for micro:bit

This extension provides support for matrix keypads (3x4 and 4x4) on the micro:bit, converted from the popular Arduino Keypad library.

## Development Setup

### Prerequisites

Before you can build and develop this extension, you'll need to set up your development environment:

1. **Node.js**: Install Node.js (version 16 or later recommended)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **PXT Command Line Tools**: Install the MakeCode command line interface globally
   ```bash
   npm install -g pxt
   ```
   
   *Note: This installs the `pxt` command globally so you can run `pxt build`, `pxt serve`, etc. from any directory. The local `npm install` in the repo only installs project dependencies, not CLI tools.*

3. **micro:bit Target**: Install the micro:bit target for PXT globally
   ```bash
   npm install -g pxt-microbit
   ```
   
   *This provides the micro:bit-specific toolchain and compilation targets that PXT needs.*

#### Alternative: Using npx (No Global Installation)
If you prefer not to install global packages, you can use npx instead:
```bash
# Instead of global installation, use npx for commands:
npx pxt build
npx pxt serve
npx pxt test
```
*Note: This approach downloads the tools each time, so it's slower but avoids global installations.*

### Building the Extension

1. **Clone the repository:**
   ```bash
   git clone https://github.com/patrickacollier/pxt-microbit-keypad.git
   cd pxt-microbit-keypad
   ```

2. **Set PXT target:**
   ```bash
   pxt target microbit
   ```
   
   *This installs the micro:bit target locally and configures the project.*

3. **Install PXT dependencies:**
   ```bash
   pxt install
   ```

4. **Build the extension:**
   ```bash
   pxt build
   ```

### Testing

1. **Run tests:**
   ```bash
   pxt test
   ```

2. **Local development server:**
   Start a local development server to work on your extension:
   ```bash
   pxt serve
   ```
   This opens a local development environment where you can edit and test your TypeScript code.
   
   *Note: To see your extension blocks in the toolbox, you'll need to import the extension into a project (see "Using the Extension" section below).*

### Using the Extension in MakeCode

#### Method 1: From GitHub (Recommended)
1. Open [MakeCode for micro:bit](https://makecode.microbit.org/)
2. Click on "Extensions" in the toolbox, you'll need to import the extension into a project to see the keypad blocks
3. Enter the repository URL: `https://github.com/patrickacollier/pxt-microbit-keypad`
4. Click "Import"

#### Method 2: From Hex File (Local Development)
1. Build your extension: `pxt build`
2. Open [MakeCode for micro:bit](https://makecode.microbit.org/)
3. Click on "Import" button
4. Select the generated `.hex` file from your `built/` directory
5. Your extension blocks will appear in the toolbox

*This is the most reliable way to test your extension blocks during development.*

#### Simulator Support
The extension includes a simulator that provides:
- Visual keypad representation in the MakeCode simulator
- Interactive key pressing simulation
- Real-time feedback of key states
- Support for both 3x4 and 4x4 keypad layouts

When you use the keypad blocks in your program, the simulator will automatically display a visual keypad that you can interact with by clicking the keys.

### Project Structure

```
pxt-microbit-keypad/
├── main.ts          # Main extension code with TypeScript blocks
├── test.ts          # Test cases
├── pxt.json         # PXT project configuration
├── package.json     # Node.js dependencies
├── tsconfig.json    # TypeScript configuration
├── README.md        # This file
├── LICENSE          # MIT License
└── sim/             # Simulator assets
    ├── keypad_sim.ts # Simulator logic for MakeCode
    └── keypad.svg   # Keypad visualization for simulator
```

### Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature-name`
3. **Make** your changes and test them locally
4. **Run** tests: `pxt test`
5. **Build** the project: `pxt build`
6. **Commit** your changes: `git commit -m "Description of changes"`
7. **Push** to your fork: `git push origin feature-name`
8. **Create** a Pull Request

### Debugging

- Use `console.log()` statements in your TypeScript code for debugging
- Check the browser console when testing in MakeCode
- Use the micro:bit simulator to test functionality without hardware

### Publishing Updates

For maintainers: To publish a new version:

1. Update the version in `pxt.json`
2. Create a git tag: `git tag v1.0.1`
3. Push the tag: `git push origin v1.0.1`
4. GitHub releases will automatically make the new version available

### Troubleshooting

**Common Issues:**
- **"pxt command not found"**: Make sure you installed pxt globally with `npm install -g pxt`
- **Build errors**: Try `npm install` to ensure all dependencies are installed
- **Extension not appearing**: Check that your `pxt.json` is properly formatted
- **Simulator issues**: Clear browser cache or try an incognito window
- **"ENOENT: no such file or directory, scandir 'libs'"**: This means your local pxt-microbit installation is incomplete. Remove the local version and use the global one:
  ```bash
  rm -rf node_modules/pxt-microbit
  npm uninstall pxt-microbit
  ```
  Then make sure you have the global version installed: `npm install -g pxt-microbit`

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