# setup-imagemagick

This action downloads the latest ImageMagick binary and adds it to the PATH.

## Inputs

## Outputs

## Example usage

```yaml
steps:
  - uses: mfinelli/setup-imagemagick@v2
  - run: magick input.jpg -resize 100x100 output.jpg
```
