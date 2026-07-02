/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

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
var __createBinding = (undefined && undefined.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (undefined && undefined.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (undefined && undefined.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const cache = __importStar(require("@actions/cache"));
const exec = __importStar(require("@actions/exec"));
const io = __importStar(require("@actions/io"));
const os = __importStar(require("os"));
const tc = __importStar(require("@actions/tool-cache"));
const https = __importStar(require("https"));
const util_1 = require("./util");
const LINUX_URL_BASE = "https://github.com/ImageMagick/ImageMagick";
function getLatestVersionUrl() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            https.get(`${LINUX_URL_BASE}/releases/latest`, (res) => {
                const { statusCode } = res;
                if (statusCode !== 302) {
                    reject(new Error(`Unable to get latest release (status code: ${statusCode}`));
                }
                else if (String(res.headers["location"]) === "") {
                    reject(new Error(`Unable to get latest release (location: ${res.headers["location"]})`));
                }
                else {
                    resolve(String(res.headers["location"]));
                }
            });
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (process.platform === "win32") {
                // todo: url changes as new versions are released and old versions do not
                //       remain available
                core.setFailed("Not currently supported on windows runners");
            }
            else if (process.platform === "darwin") {
                exec.exec("brew", ["install", "imagemagick"]);
            }
            else {
                let installLibfuse2 = core.getBooleanInput("install-libfuse2");
                if (installLibfuse2) {
                    yield exec.exec("sudo", ["apt-get", "install", "-y", "libfuse2"]);
                }
                const binPath = `${os.homedir}/bin`;
                core.addPath(binPath);
                let doCache = core.getBooleanInput("cache");
                const date = new Date();
                const month = date.toLocaleString("default", { month: "long" });
                const paths = [binPath + "/magick"];
                const cacheKey = "imagemagick-" + os.platform() + "-" + month;
                let cacheRestored = undefined;
                if (doCache) {
                    core.info("Attempting to retrieve from the cache: " + cacheKey);
                    cacheRestored = yield cache.restoreCache(paths.slice(), cacheKey);
                    if (cacheRestored !== undefined) {
                        core.info("Restored imagemagick from the cache");
                        return;
                    }
                }
                yield io.mkdirP(binPath);
                core.info("Downloading magick from: " + LINUX_URL_BASE);
                let latestUrl = yield getLatestVersionUrl();
                let version = (0, util_1.extractVersionFromUrl)(latestUrl);
                core.info("Downloading version " + version);
                const magickPath = yield tc.downloadTool(`${LINUX_URL_BASE}/releases/download/${version}/ImageMagick-${version}-gcc-x86_64.AppImage`);
                yield io.mv(magickPath, `${binPath}/magick`);
                exec.exec("chmod", ["+x", `${binPath}/magick`]);
                if (doCache && cacheRestored === undefined) {
                    core.info("Saving magick binary to the cache: " + month);
                    const cacheId = yield cache.saveCache(paths, cacheKey);
                }
            }
        }
        catch (error) {
            if (error instanceof Error) {
                core.setFailed(error.message);
            }
            else {
                core.setFailed("action failed and didn't return an error type!");
            }
        }
    });
}
run();
//# sourceMappingURL=index.js.map
