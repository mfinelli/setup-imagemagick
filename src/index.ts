import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'

const LINUX_BIN = 'https://download.imagemagick.org/ImageMagick/download/binaries/magick'

export async function run(): Promise<void> {
  try {
    if (process.platform === 'win32') {
      // todo: url changes as new versions are released and old versions do not
      //       remain available
      core.setFailed('Not currently supported on windows runners')
      return
    } else if(process.platform === 'darwin') {
      // todo: homebrew install imagemagick
      core.setFailed('Not currently supported on macos runners')
      return
    } else {
      const magickPath = await tc.downloadTool(LINUX_BIN)
      core.addPath(magickPath)
    }
  } catch(error) {
    core.setFailed(error.message)
  }
}
