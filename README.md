# setup-imagemagick

This action downloads the latest ImageMagick binary and adds it to the PATH.

## Inputs

| Name               | Type    | Description                                                                          |
| ------------------ | ------- | ------------------------------------------------------------------------------------ |
| `cache`            | Boolean | Cache the `magick` download (Ubuntu runners only)                                    |
| `install-libfuse2` | Boolean | Automatically install `libfuse2` so `magick` AppImage works on Ubuntu out-of-the-box |

## Outputs

## Example usage

```yaml
steps:
  - uses: mfinelli/setup-imagemagick@v6
  - run: magick input.jpg -resize 100x100 output.jpg
```
