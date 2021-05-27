# nimiBoost README

This is the README for your extension "nimiBoost". After writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

Requires an installation of Nim and Nimib. There is a separate Nim extension for general Nim programming. 

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

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



