import { join, relative } from "@std/path";
import { walk } from "./util.ts";
import puppeteer from "puppeteer";

await walk(async (path) => {
  const command = new Deno.Command(Deno.execPath(), {
    cwd: path,
    args: [
      "run",
      "build",
      "--base",
      `/${relative(Deno.cwd(), path)}/`,
      "--out",
      join(Deno.cwd(), "dist", path),
    ],
  });
  const output = await command.output();
  if (output.success) {
    console.log(`${path} build successfully`);
  } else {
    console.log(`${path} build failed`);
    console.log("--- stderr ---");
    console.log(new TextDecoder().decode(output.stderr));
    console.log();
    console.log("--- out ---");
    console.log(new TextDecoder().decode(output.stdout));
    Deno.exit(1);
  }
});

await new Deno.Command(Deno.execPath(), {
  args: ["run", "-A", "index.tsx"],
  stdout: "null",
  stderr: "null",
}).output();

const command = new Deno.Command(Deno.execPath(), {
  args: ["task", "serve"],
  stdout: "null",
  stderr: "null",
});
const child = command.spawn();

try {
  Deno.mkdirSync(join(Deno.cwd(), "dist", "covers"));
} catch {
  //
}

try {
  const browser = await puppeteer.launch();

  await walk(async (path) => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`http://localhost:8000/${path}`);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const outputPath: `${string}.png` = `${
      join(Deno.cwd(), "dist", "covers", path.replace("/", "_"))
    }.png`;
    await page.screenshot({ path: outputPath });
    console.log(`Screenshot saved to ${outputPath}`);
    await browser.close();
  });
  await browser.close();
} finally {
  child.kill();
}
