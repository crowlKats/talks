import { join, relative } from "@std/path";
import { TextLineStream } from "@std/streams";
import talks from "./talks.json" with { type: "json" };
import { walk } from "./util.ts";
//import puppeteer from "puppeteer";

// Stream a child's output line by line, prefixing each line with `prefix` so
// the interleaved output of concurrent builds stays readable.
function pipePrefixed(
  readable: ReadableStream<Uint8Array>,
  prefix: string,
  write: (msg: string) => void,
): Promise<void> {
  return readable
    .pipeThrough(new TextDecoderStream() as TransformStream<Uint8Array, string>)
    .pipeThrough(new TextLineStream())
    .pipeTo(
      new WritableStream({
        write(line) {
          write(`${prefix} ${line}`);
        },
      }),
    );
}

await walk(async (path) => {
  const prefix = `[${path}]`;
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
    stdout: "piped",
    stderr: "piped",
  });
  const child = command.spawn();
  const stdout = pipePrefixed(child.stdout, prefix, (msg) => console.log(msg));
  const stderr = pipePrefixed(child.stderr, prefix, (msg) => console.error(msg));

  console.log(`${prefix} waiting for child status`);
  const status = await child.status;
  console.log(`${prefix} child status resolved: success=${status.success} code=${status.code} signal=${status.signal}`);

  console.log(`${prefix} waiting for stdio streams to drain`);
  await Promise.all([stdout, stderr]);
  console.log(`${prefix} stdio streams drained`);

  if (status.success) {
    console.log(`${prefix} build successfully`);
  } else {
    console.error(`${prefix} build failed`);
    Deno.exit(1);
  }
});

const indexChild = new Deno.Command(Deno.execPath(), {
  args: ["run", "-A", "index.tsx"],
  stdout: "piped",
  stderr: "piped",
}).spawn();
await Promise.all([
  pipePrefixed(indexChild.stdout, "[index.tsx]", (msg) => console.log(msg)),
  pipePrefixed(indexChild.stderr, "[index.tsx]", (msg) => console.error(msg)),
]);
await indexChild.status;

await Deno.writeTextFile(
  "dist/conferences",
  Array.from(new Set(talks.map((talk) => talk.conference.name))).sort().join(
    "\n",
  ),
);

/*
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
*/
