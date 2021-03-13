import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as os from 'os'
import * as path from 'path'
import * as tc from '@actions/tool-cache'

const LINUX_BIN = 'https://download.imagemagick.org/ImageMagick/download/binaries/magick'

async function run(): Promise<void> {
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
      const binPath = `${os.homedir}/bin`
      await io.mkdirP(binPath)
      const magickPath = await tc.downloadTool(LINUX_BIN)
      await io.mv(magickPath, `${binPath}/magick`)
      exec.exec('chmod', ['+x', `${binPath}/magick`])

      core.addPath(binPath)
    }
  } catch(error) {
    core.setFailed(error.message)
  }
}

run()
