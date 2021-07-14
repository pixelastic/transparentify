# Transparentify

Removes the background of any image, using the [PhotoRoom][1] API.

## Usage

```javascript
const transparentify = require('transparentify');

// Create picture.png, with the background removed
await transparentify.run('picture.jpg');
```

## Installation

You need a `PHOTOROOM_API_KEY` ([request one here][2]) available as an
environment variable, or passed as an `apiKey` option

## Options

The `run` method accepts an `option` object as the second parameters, with the
following keys:

| Key           | Description                                   | Default value                                                        |
| ------------- | --------------------------------------------- | -------------------------------------------------------------------- |
| `apiKey`      | Your PhotoRoom API key                        | `PHOTOROOM_API_KEY` environment variable                             |
| `destination` | The filepath where to save the resulting file | Current directory, same basename as the input, with `.png` extension |

## Command line usage

The module also comes with a `transparentify` command line script. Usage is as
follow:

```shell
# Creates picture.png in the current directory
$ transparentify ./picture.jpg

# Creates ./dist/final.png
$ transparentify ./picture.jpg ./dist/final.png
```

You need a `PHOTOROOM_API_KEY` env variable for this to work.

## Notes

Note that images created through this method are not optimized, so we recommend
you minify them after creation.

[1]: https://www.photoroom.com/
[2]: https://dashboard.photoroom.com/accounts/signup/
