/**
 * Copyright 2026 Mario Finelli
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

import * as https from "https";

export function extractVersionFromUrl(url: string): string {
  const regex =
    /^https:\/\/github\.com\/ImageMagick\/ImageMagick\/releases\/tag\/(.*)$/;
  const match = url.match(regex);
  if (match === null) {
    return "";
  } else {
    return match[1];
  }
}

export function getAppImageDownloadUrls(version: string): string[] {
  return [
    `https://github.com/ImageMagick/ImageMagick/releases/download/${version}/ImageMagick-${version}-x86_64.AppImage`,
    `https://github.com/ImageMagick/ImageMagick/releases/download/${version}/ImageMagick-${version}-gcc-x86_64.AppImage`,
  ];
}

export function urlExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const request = https.get(
      url,
      { method: "HEAD" },
      (response) => {
        const statusCode = response.statusCode ?? 0;
        response.resume();
        resolve(statusCode >= 200 && statusCode < 400);
      },
    );

    request.on("error", () => resolve(false));
  });
}

export async function getAppImageDownloadUrl(
  version: string,
  exists: (url: string) => Promise<boolean> = urlExists,
): Promise<string> {
  const urls = getAppImageDownloadUrls(version);

  for (const url of urls) {
    if (await exists(url)) {
      return url;
    }
  }

  return urls[0];
}
