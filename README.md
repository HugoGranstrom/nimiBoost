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

- Preview current Nimib-file using the task `Nimib Preview` or the shortcut `Ctrl+K V` (`Ctrl+K`, release, `V`).


## Requirements

Requires an installation of Nim and Nimib. There is a separate Nim extension for general Nim programming. 

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

### 0.1

Initial release of NimiBoost



