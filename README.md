# nimiBoost
## Features

- Syntax highlighting for markdown in strings marked with `md` or `fmd`. Example:

```nim
nbText: md"""
# The markdown
- goes
- here
"""
```

- Preview current Nimib-file using the task `Nimib Preview`, clicking on `NimiBoost 🚀` in the statusbar or the shortcut `Ctrl+K V` (`Ctrl+K`, release, `V`).
  - `codeAsInSource` setting is available to use `-d:nimibPreviewCodeAsInSource` in the preview.
## Requirements

Requires an installation of Nim and Nimib. There is a separate Nim extension for general Nim programming. 

## Installation
- VSCode Marketplace: https://marketplace.visualstudio.com/items?itemName=hugogranstrom.nimiboost
- Open-VSX: https://open-vsx.org/extension/hugogranstrom/nimiboost 

You may have to restart VSCode for all features to activate. 
## Known Issues

- Only triple-quote strings supported.
- It's picky about where the ending `"""` is. It has to be on it's own row. So this is **not** allowed:
```nim
nbText: """
# Header
text, more text and even more text"""
# """ <-- This is the correct position!
```

## Release Notes
### 0.4
- No more annoying popups saying that the compilation has started and succeded! Now all of that happens in the statusbar at the bottom. 
- new configuration option `cmdArgs` to pass in command line arguments to the compiler.
- `-d:release` is no longer the default, use above-mentioned configuration if you want to compile in release mode.

### 0.3.1
Limit the preview keybindings to Nim files (it tried to run it on markdown files otherwise).

### 0.3
Preview mode is upgraded to understand `nimib.toml` files and will no longer create temporary folders. Files will go where nimib would have put them. The old command is still available but under the name `Nimib Preview (Legacy)` which you can add your own keybinding for if you want to keep it. This means themes like nimiBook will have correct styling and loading of files works as expected in nimib.
### 0.2
- Support nimib 0.2
- Added setting to enable `codeAsInSource`.
### 0.1.2
Fix syntax highlighting for indented `nbText` blocks.

### 0.1.1

Improved the error experience. Now the `stderr` is shown in the `Output` window. 

### 0.1

Initial release of NimiBoost

## Todo
Empty for now.




