/**
 * Copyright 2021 Mario Finelli
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as core from "@actions/core";
import * as cache from "@actions/cache";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as os from "os";
import * as path from "path";
import * as tc from "@actions/tool-cache";

const LINUX_BIN = "https://imagemagick.org/archive/binaries/magick";

async function run(): Promise<void> {
  try {
    if (process.platform === "win32") {
      // todo: url changes as new versions are released and old versions do not
      //       remain available
      core.setFailed("Not currently supported on windows runners");
    } else if (process.platform === "darwin") {
      exec.exec("brew", ["install", "imagemagick"]);
    } else {
      const binPath = `${os.homedir}/bin`;
      core.addPath(binPath);

      let doCache = core.getBooleanInput("cache");
      const date = new Date();
      const month = date.toLocaleString("default", { month: "long" });
      const paths = [binPath + "/magick"];
      const cacheKey = "imagemagick-" + os.platform() + "-" + month;
      const restoreKeys = ["imagemagick-" + os.platform()];
      let cacheRestored = undefined;

      if (doCache) {
        core.info("Attempting to retrieve from the cache: " + cacheKey);
        cacheRestored = await cache.restoreCache(paths, cacheKey, restoreKeys);

        core.info("response from cache: " + cacheRestored);

        if (cacheRestored !== undefined) {
          core.info("Restored imagemagick from the cache");
          return;
        }
      }

      await io.mkdirP(binPath);
      core.info("Downloading magick from: " + LINUX_BIN);
      const magickPath = await tc.downloadTool(LINUX_BIN);
      await io.mv(magickPath, `${binPath}/magick`);
      exec.exec("chmod", ["+x", `${binPath}/magick`]);

      if (doCache && cacheRestored === undefined) {
        core.info("Saving magick binary to the cache: " + month);
        const cacheId = await cache.saveCache(paths, cacheKey);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("action failed and didn't return an error type!");
    }
  }
}

run();
