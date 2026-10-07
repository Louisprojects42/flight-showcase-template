import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.PREVIEW_URL || "http://localhost:3000";
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1, reducedMotion: "no-preference" });
  await page.goto(base);
  await page.evaluate(() => { localStorage.removeItem("showcase-motion"); });
  await page.reload();
  await page.waitForSelector('[data-live="true"]', { timeout: 60000 });
  await mkdir("public/posters", { recursive: true });
  for (const [name, time] of [["intro", 0], ["pitch", .29], ["detail", .47], ["wide", .6], ["close", 1]]) {
    await page.evaluate(time => {
      const track = document.querySelector(".film-track");
      window.scrollTo(0, track.getBoundingClientRect().top + scrollY + (track.offsetHeight - innerHeight) * time);
    }, time);
    await page.waitForFunction(time => Math.abs(Number(document.querySelector(".film-stage").style.getPropertyValue("--t")) - time) < .001, time);
    const { image, background } = await page.evaluate(() => {
      const canvas = document.querySelector(".live-scene canvas");
      const sample = document.createElement("canvas"); sample.width = sample.height = 1;
      const context = sample.getContext("2d");
      context.fillStyle = getComputedStyle(document.querySelector(".film-track")).backgroundColor;
      context.fillRect(0, 0, 1, 1);
      return { image: canvas.toDataURL("image/png").split(",")[1], background: Array.from(context.getImageData(0, 0, 1, 1).data) };
    });
    const png = Buffer.from(image, "base64");
    const output = await sharp(png).flatten({ background: { r: background[0], g: background[1], b: background[2] } }).webp({ quality: 80 }).toBuffer();
    await writeFile("public/posters/" + name + ".webp", output);
    console.log(name + ": " + output.length + " bytes");
  }
} finally {
  await browser.close();
}
