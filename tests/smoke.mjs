// Smoke test: load all routes across breakpoints, capture screenshots, log console.
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const BASE = "http://localhost:5173";
const OUT = "tests/screenshots";
const ROUTES = [
  { path: "/", name: "home" },
  { path: "/projects", name: "projects" },
  { path: "/portal", name: "portal" },
  { path: "/about/marco", name: "about-marco" },
  { path: "/about/till", name: "about-till" },
  { path: "/impressum", name: "impressum" },
  { path: "/agb", name: "agb" },
];
const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "desktop", width: 1440, height: 900 },
];

if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });

async function scrollThroughPage(page) {
  // trigger framer-motion whileInView + give videos time to start
  await page.evaluate(async () => {
    const total = document.body.scrollHeight;
    const step = window.innerHeight;
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 200));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
}

const browser = await chromium.launch({ headless: true });
const allErrors = [];
const allRequests = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    ignoreHTTPSErrors: true,
  });
  const page = await ctx.newPage();

  const errors = [];
  const requests404 = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[${vp.name}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`[${vp.name}] PAGE ${err.message}`));
  page.on("response", (res) => {
    const u = res.url();
    if (res.status() >= 400 && !u.includes(".mp4")) requests404.push(`[${vp.name}] ${res.status()} ${u}`);
  });

  for (const r of ROUTES) {
    const url = BASE + r.path;
    try {
      // domcontentloaded — videos won't satisfy networkidle
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
      await page.waitForTimeout(1500); // let fonts + initial render settle
      await scrollThroughPage(page);
      await page.waitForTimeout(800);
      const file = `${OUT}/${vp.name}-${r.name}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log(`OK ${vp.name} ${r.name} → ${file}`);
    } catch (e) {
      console.log(`ERR ${vp.name} ${r.name}: ${e.message}`);
      errors.push(`[${vp.name}] navigation ${r.path}: ${e.message}`);
    }
  }

  allErrors.push(...errors);
  allRequests.push(...requests404);
  await ctx.close();
}

await browser.close();

const summary = {
  errors: allErrors,
  failedRequests: allRequests,
  errorCount: allErrors.length,
  failedRequestCount: allRequests.length,
};
await writeFile(`${OUT}/_report.json`, JSON.stringify(summary, null, 2));
console.log("\n--- SUMMARY ---");
console.log(`Console errors: ${allErrors.length}`);
console.log(`Failed requests (non-mp4): ${allRequests.length}`);
if (allErrors.length) console.log(allErrors.slice(0, 10).join("\n"));
if (allRequests.length) console.log(allRequests.slice(0, 10).join("\n"));
