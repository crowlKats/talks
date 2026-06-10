---
title: "Deno Desktop: your web app, as a native app"
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
layout: cover
---

<img src="/deno.svg" class="w-28 mx-auto mb-4">

# Deno Desktop

<div class="opacity-80 text-xl">

Your web app. As a native app. <span v-mark.underline.cyan>Today.</span>

</div>

<div class="absolute inset-0 -z-10">
  <JSRBackground />
</div>

<!--
30 minutes. This is the FIRST time we're showing this in public.

Don't say "Deno Desktop" yet — let it breathe. Land the cover, take a beat,
then go to the intro. The whole talk is a slow reveal followed by a fast tour
plus live demos.
-->

---
layout: intro-image
image: /leo.jpg
clicksStart: 1
---

# Leo Kettmeir

<div class="[&>*]:important-leading-10 opacity-80 pl-4">

Engineer at <span v-mark.auto.cyan=0>Deno</span>

I work on the <span v-mark.auto.yellow=0>runtime</span> — the parts that touch your OS

</div>

<!--
I'm Leo, I'm an engineer at Deno. I work down in the runtime — filesystem,
networking, the native edges. Which is exactly where today's story lives.
-->

---
layout: statement
---

# You built a great web app.

<div v-click class="opacity-80 mt-6 text-2xl">

Then someone asks:

</div>

<div v-click class="mt-4 text-4xl font-bold">

“Can I get it as a <span v-mark.cyan>desktop</span> app?”

</div>

<!--
Set the scene. Everyone in this room has shipped a web app. And at some point
someone — a customer, your boss, you at 2am — wants it on the desktop. A real
window. A dock icon. Offline. Native menus.

So you go looking. And that's where the pain starts.
-->

---
layout: section
---

# Picking a desktop framework <span class="opacity-50">in 2026</span>

<div v-click class="mt-8 text-xl opacity-80">

You want <span v-mark.cyan>three</span> things.

</div>

<!--
Let's be honest about the menu you face today.
-->

---
layout: three-cols
---

# <span class="block text-center">Pick two.</span>

::left::

<JumpPanel title="Consistent UI">

It looks the **same** on every OS.

No "works on my Mac, broken on Windows 10's webview."

</JumpPanel>

::middle::

<JumpPanel title="Small & fast">

The download isn't **hundreds of megabytes**.

It starts quickly and sips memory.

</JumpPanel>

::right::

<JumpPanel title="The JS ecosystem">

npm. Your framework. **Node compatibility.**

The tools you already know.

</JumpPanel>

::bottom::

<div v-click class="text-2xl mt-4">

Today you get to pick <span v-mark.underline.red>two</span>.

</div>

<!--
Three things you actually want: consistent rendering, a small fast binary, and
your JavaScript ecosystem.

Click through them. Then the punchline: pick two. Every tool today forces this
trade-off.
-->

---
layout: default
---

# The trade-off, named

<div class="grid grid-cols-2 gap-x-10 gap-y-3 mt-6 text-lg">

<div v-click>

### Electron

Bundled Chromium → **consistent**, full npm.

<span class="opacity-70">…but ~250&nbsp;MB and heavy.</span>

</div>

<div v-click>

### Tauri / Dioxus

Tiny binaries.

<span class="opacity-70">…but system webview (inconsistent), **no JS ecosystem**, and you need the native platform to build.</span>

</div>

<div v-click>

### Electrobun

Binary diffs, small-ish.

<span class="opacity-70">…but macOS-only, and still a separate toolchain.</span>

</div>

<div v-click>

### …and all of them

A **second** project. A **second** toolchain. A **second** mental model next to the web app you already have.

</div>

</div>

<!--
Quick tour, don't dwell. Electron: great, but huge. Tauri/Dioxus: small, but you
give up the JS ecosystem and you can't cross-build. Electrobun: clever diffs, but
macOS only.

The real tax underneath all of them: it's a whole separate thing to learn and
maintain, bolted onto the app you already wrote.
-->

---
layout: statement
---

<div class="text-3xl opacity-80">What if your existing web app</div>

# could just <span v-mark.cyan>become</span> a desktop app?

<div v-click class="text-2xl opacity-80 mt-6">

No rewrite. No second toolchain. One command.

</div>

<!--
So here's the question we kept asking. What if you didn't bolt anything on? What
if the web app you ALREADY have just... became the desktop app?

Beat. Then reveal.
-->

---
layout: cover
background: "#000"
transition: fade
---

<img src="/deno.svg" class="w-24 mx-auto mb-6">

# Deno Desktop

<div class="text-xl opacity-80">

```bash
deno desktop .
```

</div>

<div v-click class="mt-6 text-lg opacity-70">

First public look · shipping as an experimental feature

</div>

<!--
THE reveal. This is the moment. Say the name out loud for the first time.

"deno desktop". One subcommand, built into the runtime you might already have.
And that dot — that dot is the whole talk.

This is the first time we're showing it publicly. It's experimental. But it's
real, and you can run it.
-->

---
layout: fact
---

# `deno desktop .`

<div v-click class="text-2xl opacity-80 mt-4">

Point it at a <span v-mark.cyan>Next.js</span>, <span v-mark.cyan>Astro</span>, <span v-mark.cyan>SvelteKit</span>, <span v-mark.cyan>Nuxt</span>, <span v-mark.cyan>Fresh</span>… project.

</div>

<div v-click class="text-2xl mt-4">

You get a native app. **Zero config.**

</div>

<div v-click class="text-base opacity-60 mt-6">

Nobody else does this.

</div>

<!--
The headline feature. The dot means "auto-detect my framework." We inspect your
project — your config, your build output — figure out you're a Next app, run your
production server, and point a native window at it.

You change nothing. No desktop entrypoint, no IPC wiring, no new build step.

This zero-config framework detection is the thing no other desktop framework
does.
-->

---
layout: section
---

# How does that even work?

<!--
Let's pull back the curtain one level — because the mental model is so simple it
makes everything else obvious.
-->

---
layout: two-cols-header
---

# Your app is just a server

::left::

<div class="pr-4">

The runtime:

<v-clicks>

- allocates a local port
- sets `DENO_SERVE_ADDRESS`
- opens a native window
- navigates it to `http://127.0.0.1:<port>`

</v-clicks>

<div v-click class="mt-4 opacity-80">

Your code is an ordinary `Deno.serve()`.

</div>

</div>

::right::

```ts {all|2-4}
// main.ts — the whole app
Deno.serve(() =>
  new Response("<h1>Hello, desktop 👋</h1>", {
    headers: { "content-type": "text/html" },
  })
);
```

<div v-click class="mt-4">

<Win title="Hello">
  <h1 class="text-3xl font-bold">Hello, desktop 👋</h1>
</Win>

</div>

<!--
Here's the trick. A desktop app, to us, is a web server plus a window.

The runtime picks a port, tells Deno.serve to bind there, opens a window, and
points it at localhost. That's it.

So a framework is just a server too — which is why "deno desktop ." works for any
of them. There's no special desktop API you have to adopt to get on screen.
-->

---
layout: section
---

# Let's build one.

<div class="text-xl opacity-70 mt-4">

live demo

</div>

<!--
DEMO 1 — ~3 min. Keep it tight.

1. `deno desktop main.ts` → window opens.
2. Add a Deno.BrowserWindow + a binding, call it from a button.
3. Show alert() popping a NATIVE dialog.

Fallback if the demo gods are unkind: the next slides show the same code.
-->

---
layout: two-cols-header
---

# Talking to the OS

::left::

<div class="pr-4 text-lg">

Reach native capabilities through a **browser-shaped** API:

<v-clicks>

- `Deno.BrowserWindow` — windows, menus
- `Deno.Tray` / `Deno.dock`
- standard events: `click`, `resize`, `focus`…
- `alert` / `confirm` / `prompt` → real native dialogs

</v-clicks>

</div>

::right::

```ts {all|6-9|11-12}
const win = new Deno.BrowserWindow({
  title: "My App",
});

// expose a Deno function to the page
win.bind("readNote", async () => {
  // full runtime: fs, net, npm, permissions
  return await Deno.readTextFile("note.txt");
});

// in the page:  await bindings.readNote()
confirm("Ship it?"); // ← native popup
```

<!--
Once you're on screen, you talk to the OS through APIs that look like the browser
you already know. Windows, tray, dock. Events are the DOM events you already use.

And the nice touch: alert, confirm, prompt — in normal Deno those print to the
terminal. On the desktop, they become real native dialogs. The web primitive,
upgraded.

bind() exposes a Deno-side function to the page. From the page you just call
bindings.readNote(). Which brings me to the part I'm proud of...
-->

---
layout: two-cols-header
---

# Bindings are <span v-mark.cyan>not</span> IPC

::left::

<div class="text-lg pr-4">

Electron / Tauri: backend ↔ UI cross **processes** → serialize, socket, deserialize.

<div v-click class="mt-4">

Deno Desktop: the engine and the Deno runtime are **threads in one process**.

</div>

<div v-click class="mt-4 opacity-80">

Calls go over in-process channels.<br/>
No sockets. No serialization tax.

</div>

</div>

::right::

<div class="flex flex-col items-center justify-center h-full gap-3 text-center">

<div v-click="1" class="opacity-60 line-through">

`renderer → socket → backend process`

</div>

<div v-click="2" class="text-xl">

`page  ⇄  mpsc channel  ⇄  Deno`

</div>

<div v-click="3" class="text-sm opacity-70">

same process · same memory

</div>

</div>

<!--
A word on how bind() works, because it's an architectural difference, not a
detail.

In Electron and Tauri, your backend and your UI are separate OS processes. Every
call is IPC: serialize, push through a socket, deserialize on the other side.

We don't have two processes for that. The web engine runs on the main thread, the
Deno tokio runtime on another — same process. Calls are just messages over
in-process channels. No socket, no serialization overhead.
-->

---
layout: section
---

# The dev loop

<!--
Shipping is one thing. But how does it FEEL to build with? This is where it gets
fun.
-->

---
layout: fact
---

# `deno desktop --hmr`

<div v-click class="text-2xl opacity-80 mt-4">

Edit. Save. <span v-mark.cyan>See it instantly.</span>

</div>

<div class="grid grid-cols-2 gap-6 mt-8 text-left text-lg">

<JumpContent title="Framework apps">

Your framework's own dev server runs — fast refresh, state, error overlays. All of it.

</JumpContent>

<JumpContent title="Plain apps">

Deno watches your files and hot-swaps modules into the live V8. No tooling required.

</JumpContent>

</div>

<div v-click class="text-base opacity-60 mt-6">

The runtime and the window stay alive. No restart, no reconnect.

</div>

<!--
HMR. With --hmr, you get the edit-save-instant loop you expect from the web.

If you're a framework app, we just let your framework's dev server do its thing —
Next fast refresh, Vite HMR, whatever you already love, untouched.

If you're a plain app, Deno watches the files and hot-swaps the changed module
into the running V8 instance directly. Same loop, no framework needed.

Either way the process stays warm — nothing tears down.
-->

---
layout: section
---

# HMR, live.

<div class="text-xl opacity-70 mt-4">

live demo

</div>

<!--
DEMO 2 — ~2 min. Window and editor side by side. Change a heading and a color,
save, watch it update without losing state. Then add a top-level export to show
the graceful full-reload fallback if you want.
-->

---
layout: two-cols-header
---

# One engine isn't enough

::left::

<div class="pr-4 text-lg">

`--backend` picks how you render:

<div v-click class="mt-4">

**CEF** <span class="opacity-70">(default)</span><br/>
Bundled Chromium. Pixel-identical everywhere. Larger.

</div>

<div v-click class="mt-3">

**WebView**<br/>
The OS's own engine. Tiny bundle. Varies by platform.

</div>

<div v-click class="mt-4 text-base opacity-80">

Same app code. One flag.

</div>

</div>

::right::

```bash {all|1|2}
deno desktop --backend cef     .
deno desktop --backend webview .
```

<div v-click="3" class="mt-6">

<div class="text-sm opacity-70 mb-1">consistency ⇄ size</div>

```text
CEF      ████████████  consistent · larger
WebView  ██            tiny · OS-dependent
```

</div>

<!--
You also get to choose your rendering engine, per build, with one flag.

CEF — bundled Chromium — is the default: identical rendering on every OS, like
Electron, at the cost of size.

WebView uses the OS's own engine: tiny bundle, but rendering and features vary by
platform and OS version.

Same code either way. It's literally a flag. Pick your point on the consistency-
versus-size line.
-->

---
layout: two-cols-header
---

# Debug both sides at once

::left::

<div class="pr-4 text-lg">

A desktop app has two worlds:

<v-clicks>

- the **page** (your UI in the engine)
- the **Deno** runtime (your backend)

</v-clicks>

<div v-click class="mt-4">

Everywhere else you debug **one or the other**.

</div>

<div v-click class="mt-3 text-xl">

`--inspect` gives you <span v-mark.cyan>both</span>, in one DevTools.

</div>

</div>

::right::

<div class="flex items-center justify-center h-full">

<Win title="DevTools">
  <div class="font-mono text-sm space-y-2">
    <div>▸ Elements · Console · Network</div>
    <div class="opacity-60">— page (CEF) —</div>
    <div class="opacity-60">— deno-desktop runtime —</div>
    <div v-click class="text-cyan-400">one session · both targets</div>
  </div>
</Win>

</div>

<!--
Debugging. Your app is two worlds: the page running in the engine, and the Deno
runtime behind it.

In every other stack you attach to one or the other and keep context-switching.
With --inspect, a single DevTools session shows both the webview and the Deno
runtime together. (CEF backend.)
-->

---
layout: section
---

# Now ship it.

<!--
Great dev loop. But the reason people reach for desktop frameworks is
DISTRIBUTION — and this is where the all-in-one toolchain really pays off.
-->

---
layout: two-cols-header
---

# From code to a real binary

::left::

```bash {all|1|2|3}
deno desktop -o MyApp.app   .   # macOS
deno desktop -o MyApp.msi   .   # Windows
deno desktop -o MyApp.AppImage . # Linux
```

<div v-click="4" class="mt-6 text-lg">

Format is chosen by the **extension**:<br/>
`.app` · `.dmg` · `.msi` · `.exe` · `.AppImage`

</div>

::right::

<div v-click="5">

<Win title="MyApp.app">
  <div class="text-sm font-mono opacity-80 space-y-1">
    <div>Contents/</div>
    <div class="pl-4">MacOS/        <span class="opacity-50">← your code + runtime</span></div>
    <div class="pl-4">Frameworks/   <span class="opacity-50">← the engine</span></div>
    <div class="pl-4">Resources/</div>
    <div class="pl-4">Info.plist</div>
  </div>
</Win>

<div class="mt-4 text-base opacity-80">

Self-contained. No system Deno required to run it.

</div>

</div>

<!--
First, a real bundle. Same command, but with -o. The extension picks the format:
a .app or .dmg on macOS, .msi on Windows, .AppImage on Linux.

What comes out is self-contained — your code, the Deno runtime, and the engine,
all embedded. The end user doesn't need Deno installed.
-->

---
layout: fact
---

# Build every platform <span v-mark.cyan>from one machine</span>

```bash
deno desktop --all-targets .
```

<div class="grid grid-cols-2 gap-x-8 gap-y-1 mt-6 text-base font-mono opacity-80 max-w-2xl mx-auto">
<div v-click>x86_64-apple-darwin</div>
<div v-click>aarch64-apple-darwin</div>
<div v-click>x86_64-pc-windows-msvc</div>
<div v-click>x86_64-unknown-linux-gnu</div>
<div v-click>aarch64-unknown-linux-gnu</div>
<div v-click class="opacity-60">…one command</div>
</div>

<div v-click class="mt-6 text-lg opacity-80">

The JS bundle is portable — only the runtime + engine differ per target. No native cross-compile toolchain.

</div>

<!--
And here's a thing the Rust-based tools genuinely can't do easily: cross-compile
from one machine.

Tauri and Dioxus need the actual target platform to build. We don't — your JS is
platform-independent, and we just fetch the right prebuilt runtime and engine for
each target. One Mac can produce Windows, Linux, and macOS builds. Like
deno compile --target, because it IS deno compile underneath.
-->

---
layout: two-cols-header
---

# Updates, built in

::left::

<div class="pr-4 text-lg">

<v-clicks>

- ships **binary diffs**, not whole apps
- a 4&nbsp;KB patch, not a 200&nbsp;MB redownload
- applies on next launch
- **auto-rollback** if the new build won't boot

</v-clicks>

</div>

::right::

```ts {all|2|3-5|6-8}
Deno.autoUpdate({
  url: "https://releases.example.com/app",
  onUpdateReady(version) {
    // staged — restart to apply
  },
  onRollback(reason) {
    // last update failed; we recovered
  },
});
```

<div v-click class="mt-3 text-sm opacity-70">

`Deno.desktopVersion` — baked from `deno.json`

</div>

<!--
Auto-update, in the runtime — not a plugin.

We ship binary diffs. The user already has v1; to get to v2 they download a tiny
patch against the bytes they have, not the whole app again. A few KB instead of
hundreds of MB.

It applies on next launch, and — this is the important safety bit — if the new
build fails to boot, the next launch automatically rolls back to the version that
worked and tells you why. A bad update can't brick the app.
-->

---
layout: two-cols-header
---

# A desktop app you can <span v-mark.cyan>trust</span>

::left::

<div class="pr-4 text-lg">

Every other desktop framework: the app can touch **anything** — your files, your network — silently.

<div v-click class="mt-4">

Deno already has a **permission system**.

</div>

<div v-click class="mt-3 text-xl">

So your desktop app does too.

</div>

</div>

::right::

```bash {all|1|2}
deno desktop .                       # sandboxed
deno desktop --allow-read=./data .   # just this
```

<div v-click="3" class="mt-6 text-base opacity-80">

The app can't read your home directory or phone home unless **you** allowed it.

</div>

<!--
And one thing that's genuinely new for desktop: trust.

Think about it — every Electron or Tauri app you install can read every file you
own and talk to any server, silently. Nobody gates that.

Deno was built around a permission system from day one. So a Deno Desktop app
inherits it: it's sandboxed unless you grant access. That's a property no other
desktop framework can offer today.
-->

---
layout: section
---

# So where does it land?

<!--
Let's put it next to everything else and be honest about the trade-offs.
-->

---
layout: default
class: text-sm
---

# The landscape

<div class="overflow-hidden mt-2">

|                           | Electron | Tauri / Dioxus | Electrobun  | **Deno Desktop**        |
| ------------------------- | -------- | -------------- | ----------- | ----------------------- |
| **Language**              | JS/TS    | Rust + web     | JS/TS (Bun) | **JS/TS (Deno)**        |
| **Consistent UI**         | ✅       | ❌             | ❌          | **✅ (CEF)**            |
| **npm / Node compat**     | ✅       | ❌             | ✅          | **✅**                  |
| **Backend ↔ UI**          | IPC      | IPC            | IPC         | **in-process channels** |
| **Framework auto-detect** | ❌       | ❌             | ❌          | **✅**                  |
| **HMR**                   | ❌       | ✅             | ✅          | **✅**                  |
| **Built-in auto-update**  | ✅ full  | ❌             | ✅ diff     | **✅ diff**             |
| **Cross-compile**         | ✅       | ❌             | ❌          | **✅ `--target`**       |
| **Permission sandbox**    | ❌       | ❌             | ❌          | **✅**                  |

</div>

<div v-click class="mt-3 text-base opacity-80">

The honest cost: bundled CEF is **big**. Use the WebView backend when size matters.

</div>

<!--
Here's the whole landscape on one slide. I'm not going to read it — let people
scan.

The columns where we stand out: framework auto-detect, in-process calls,
cross-compile, and the permission sandbox. Together those don't exist anywhere
else.

And the honest trade-off, last row: the CEF backend is large, same as Electron.
That's the price of consistent rendering. If size matters more than pixel-
identical UI, switch to the WebView backend. We give you the choice instead of
making it for you.
-->

---
layout: two-cols-header
---

# Why a subcommand, not a new tool?

::left::

<div class="pr-4 text-lg">

<v-clicks>

- it **reuses** `deno compile`, the module loader, npm support, permissions, HMR
- `deno --help` → "oh, I can build desktop apps?"
- one config file, one toolchain, one mental model

</v-clicks>

</div>

::right::

<div v-click class="flex items-center justify-center h-full">

<div class="text-center">
<div class="text-5xl">🦕</div>
<div class="mt-4 text-xl opacity-80">It's not a framework<br/>bolted onto Deno.</div>
<div v-click class="mt-3 text-2xl">It's Deno, all the way down.</div>
</div>

</div>

<!--
Why is this a subcommand and not a separate project? Because it's not bolted on —
it's built on the exact infrastructure that already exists. deno compile does the
bundling. The same module loader, npm support, permission system, and HMR you use
everywhere else.

The payoff for you: there's no new toolchain. You run deno --help and discover you
can ship a desktop app. One config file. One mental model. It's Deno all the way
down.
-->

---
layout: statement
---

# This is a <span v-mark.cyan>first look</span>.

<div class="grid grid-cols-2 gap-6 mt-8 text-left text-lg">

<JumpContent title="Today">

Experimental, on a branch, but real. macOS, Windows, Linux. You can run it.

</JumpContent>

<JumpContent title="Coming">

One-flag code signing · a shared system engine (apps drop to a few MB) · warm-start in milliseconds.

</JumpContent>

</div>

<!--
Be straight with the audience. This is experimental — it's the first time we're
showing it. It runs on all three desktop platforms today.

Where it's going: code signing as a single flag instead of a day of yak-shaving;
a shared system engine so individual apps drop from hundreds of MB to a few; and a
warm engine so windows appear in milliseconds instead of bootstrapping Chromium
every time.
-->

---
layout: section
---

# Let's ship something, live.

<div class="text-xl opacity-70 mt-4">

a real framework app → a real binary

</div>

<!--
DEMO 3 (the closer) — ~3 min, optional if time is tight.

`deno desktop .` on an actual Next/Vite project → native window. Then
`deno desktop -o App.app .` and open the bundle. End on the artifact.

If you're behind on time, SKIP straight to the recap. Better to land the close
than to rush a demo.
-->

---
layout: fact
---

# Your web app is now a <span v-mark.cyan>desktop toolkit</span>.

<div class="text-left max-w-xl mx-auto mt-6 text-lg space-y-1">

<v-clicks>

- `deno desktop .` — zero-config, any framework
- native APIs, in-process calls, HMR
- cross-compile · installers · auto-update · permissions
- no second project, no second toolchain

</v-clicks>

</div>

<!--
The recap, fast. One command turns any web framework into a desktop app. You get
native APIs and a real dev loop. You ship with cross-compile, installers, binary
auto-update, and a permission sandbox. And you did it without starting a second
project.
-->

---
layout: quote
---

# Try it.

<div class="text-xl opacity-90 mt-4">

```bash
deno desktop .
```

</div>

<div class="mt-8 opacity-80">

docs → https://docs.deno.com/go/desktop

</div>

<div class="mt-2 opacity-80">

find me → @crowlkats

</div>

<div v-click class="mt-8 text-2xl">

Thank you. 🦕

</div>

<div class="absolute inset-0 -z-10">
  <JSRBackground />
</div>

<!--
That's it. It's experimental, it's out there, and the simplest way to understand
it is to point it at a project you already have and run "deno desktop dot".

Try it, tell me what breaks, and thank you.

(Leave the docs link up during Q&A.)
-->
