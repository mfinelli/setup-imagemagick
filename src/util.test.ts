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

import { extractVersionFromUrl, getAppImageDownloadUrl } from "./util";

describe("extractVersionFromUrl", () => {
  test("returns the expected version", () => {
    let url =
      "https://github.com/ImageMagick/ImageMagick/releases/tag/7.1.2-26";
    expect(extractVersionFromUrl(url)).toBe("7.1.2-26");
  });
});

describe("getAppImageDownloadUrl", () => {
  test("prefers the non-gcc AppImage when available", async () => {
    const exists = jest.fn(async (url: string) =>
      url.includes("ImageMagick-7.1.2-26-x86_64.AppImage"),
    );

    await expect(getAppImageDownloadUrl("7.1.2-26", exists)).resolves.toBe(
      "https://github.com/ImageMagick/ImageMagick/releases/download/7.1.2-26/ImageMagick-7.1.2-26-x86_64.AppImage",
    );
  });

  test("falls back to the gcc AppImage when needed", async () => {
    const exists = jest.fn(async (url: string) =>
      url.includes("ImageMagick-7.1.2-26-gcc-x86_64.AppImage"),
    );

    await expect(getAppImageDownloadUrl("7.1.2-26", exists)).resolves.toBe(
      "https://github.com/ImageMagick/ImageMagick/releases/download/7.1.2-26/ImageMagick-7.1.2-26-gcc-x86_64.AppImage",
    );
  });
});
