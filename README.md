# setup-imagemagick

This action downloads the latest ImageMagick binary and adds it to the PATH.

## Inputs

## Outputs

## Example usage

```yaml
steps:
  - uses: mfinelli/setup-imagemagick@v2
  - run: magick input.jpg -resize 100x100 output.jpg

  # IMPORTANT: on ubuntu-22.04/ubuntu-latest runners it is necessary to
  # install libfuse2 before running the `magick` command as AppImage still
  # depends on libfuse2 which is no longer shipped by default.
  # see the AppImage project for issues about shipping static fuse2 or
  # upgrading to fuse3: https://github.com/AppImage/AppImageKit
  # see: https://github.com/mfinelli/setup-imagemagick/issues/242
  - run: sudo apt-get install -y libfuse2
```
