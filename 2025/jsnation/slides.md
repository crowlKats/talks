---
theme: ../../themes/jsr
title: "JSR: Building an Open Registry for the JavaScript Community"
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
addons:
  - slidev-addon-excalidraw
layout: cover
---

<img src="/jsr.svg" class="w-32 mx-auto">

Building an Open Registry for the JavaScript Community

<div class="absolute inset-0 -z-10">
  <JSRBackground />
</div>

---
layout: intro-image
image: /leo.jpg
clicksStart: 1
---

# Leo Kettmeir

<div class="[&>*]:important-leading-10 opacity-80 pl-4">

Engineer at <span v-mark.auto.blue=0>Deno</span>

Maintainer of <span v-mark.auto.yellow=0>JSR</span>

</div>

<!--

I am an engineer at Deno,

-->

---
layout: two-cols-header
---

# What is <span class="text-[--jsr-yellow]">JSR</span>?

::left::

- supports TypeScript out of the box
- does _**not**_ replace npm, it lives alongside it
- compatible across different runtimes
- completely open-source and free
- Has built-in support by yarn and pnpm<br/>(but not npm)

::right::

<div class="pl-10">
  <img
    v-motion
    :initial="initial"
    :enter="getFinal()"
    src="/typescript.png"
    class="relative size-20 left-20"
  />

<div class="w-60 relative left-50">
    <div class="relative w-40 h-40 *:size-20 *:absolute *:inset-0">
      <img
        v-motion
        :initial="initial"
        :enter="getFinal()"
        src="/npm.svg"
        class="left-10"
      />
      <img
        v-motion
        :initial="initial"
        :enter="getFinal()"
        src="/pnpm.svg"
        class="right-14 top-10"
      />
      <img
        v-motion
        :initial="initial"
        :enter="getFinal()"
        src="/yarn.svg"
        class="left-18 top-8"
      />
    </div>
  </div>

<div class="w-60 relative">
    <div class="relative w-40 h-40 *:size-20 *:absolute *:inset-0">
      <img
        v-motion
        :initial="initial"
        :enter="getFinal()"
        src="/bun.svg"
        class="right-10 top-10"
      />
      <img
        v-motion
        :initial="initial"
        :enter="getFinal()"
        src="/cf-workers.svg"
        class="left-13 top-10"
      />
      <img
        v-motion
        :initial="initial"
        :enter="getFinal()"
        src="/node.svg"
        class="right-13 bottom-3"
      />
      <img
        v-motion
        :initial="initial"
        :enter="getFinal()"
        src="/deno.svg"
        class="left-15"
      />
    </div>
  </div>
</div>

<script setup lang="ts">
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const initial = {
 x: 0,
 y: 0,
};

function getFinal() {
  return {
    y: randomIntFromInterval(0, 15),
    x: randomIntFromInterval(0, 15),
    transition: {
      y: {
        delay: randomIntFromInterval(0, 1000),
        duration: randomIntFromInterval(2700, 3000),
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "mirror",
      },
      x: {
        delay: randomIntFromInterval(0, 1000),
        duration: randomIntFromInterval(2700, 3000),
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "mirror",
      }
    },
  };
}
</script>

<!--
- "supports TypeScript out of the box"

  This isn't just a feature; it was a foundational technical goal.

  To achieve this, we had to build a backend pipeline that ingests raw TypeScript files on publish.

  It then transpiles the code, generates .d.ts type definitions, and even creates the documentation automatically.

  This is a significant piece of cloud infrastructure that acts as a build-tool-in-the-cloud, saving developers from that complexity.

- "does not replace npm, it lives alongside it"

   This was a critical strategic decision for adoption.

   Technically, this means JSR has a compatibility layer.

   When you use npx jsr add, we serve a special tarball that's structured to look exactly like an npm package, with a package.json that points to the transpiled JS files.

   It's an engineering solution to a community problem: lowering the barrier to entry.
-->

---
layout: three-cols
---

# <span class="text-center block">Why?</span>

::left::

<JumpPanel title="Complexity">

Publishing to NPM is **too complicated** nowadays.

Getting TypeScript to work well in npm packages is way too difficult.

</JumpPanel>

::middle::

<JumpPanel title="Innovation">

NPM has **stopped innovating**.

The JavaScript ecosystem is known for rapid change and progress, but NPM doesn't
follow suit.

</JumpPanel>

::right::

<JumpPanel title="Our Values">

Unlike **NPM which is owned by Microsoft**, JSR is open.

Open source, community, and open governance are core principles.

</JumpPanel>

---
transition: fade-out
layout: three-cols
---

# <span class="text-center block">Additional features</span>

::left::

<JumpContent title="Tokenless auth">

Allows publish packages automatically from CI without you having to configure
any static secrets.

This is done with OIDC tokens.

</JumpContent>

::middle::

<JumpContent title="Provenance">

If you use GitHub Actions, JSR can generate package public provenance
statements, which further proves the integrity of published packages.

</JumpContent>

::right::

<JumpContent title="Documentation">

JSR automatically generates documentation for your package from its source code
and types; no need to set up a separate system or docs site.

</JumpContent>

::bottom::

<div v-after>
and many more...
</div>

<!--
we dont have time for all of the features, but some more include detailed download metrics
-->

---
layout: cover
transition: fade-out
background: "#f7df1eff"
---

# <span class="text-black">Governance</span>

---

# Why is <span class="text-[--jsr-yellow]">JSR</span> open?

<div class="pt-10 flex justify-center items-center">
<Excalidraw
  drawFilePath="./open-jsr.excalidraw"
  class="w-[600px]"
  :darkMode="false"
  :background="false"
/>
</div>

---
layout: people
people:
  - name: Evan You
    title: "creator of Vue.js and Vite, founder of VoidZero"
    icon: https://github.com/yyx990803.png
  - name: Isaac Schlueter
    title: "creator of npm, cofounder of vlt.sh"
    icon: https://github.com/isaacs.png
  - name: James Snell
    title: "Node.js TSC member, Principal System Engineer at Cloudflare"
    icon: https://github.com/jasnell.png
  - name: Luca Casonato
    title: "software Engineer at Deno, TC39 representative"
    icon: https://github.com/lucacasonato.png
  - name: Ryan Dahl
    title: "creator of Node.js and Deno"
    icon: https://cdn.cloudinary.com/stichting-frontend-amsterdam/image/upload/v1674813354/dev/Dahl_Ryan_wg0lg5.png
---

# <span class="text-[--jsr-yellow]">Board Members</span>

<!--

you have to build trust.

A huge part of 'what it takes' was convincing respected, independent leaders from across the ecosystem—including the creator of npm himself—to join our governance board.

This demonstrates our commitment to being a true community project.

-->

---

# What does it do?

- Overseeing JSR's move to a foundation
- Setting the general direction of the project
- Making decisions on behalf of the project when necessary
- Determining how the governance board is to be elected in the future
- Determining how to review open source contributions to the project

---
layout: people
people:
  - name: Oliver Medhurst
    title: "creator of porffor"
    icon: https://github.com/canadahonk.png
  - name: Augustin Mauroy
    title: "contributor to NodeJS"
    icon: https://github.com/AugustinMauroy.png
  - name: "Doctor/BlackAsLight"
    title: "contributor to JSR and Deno"
    icon: https://github.com/BlackAsLight.png
---

# <span class="text-[--jsr-yellow]">Moderation Group</span>

<!--
A registry is public infrastructure.

And like any public space, it needs maintenance and safety rules.

This group handles the human side of the system—name disputes, security reports, and policy enforcement.

This is a critical, often thankless, part of what it takes to keep the registry safe and reliable for everyone.
-->

---
layout: cover
transition: fade-out
---

# So, what is this "foundation"?

<!--
in the talks with OpenJS & ECMA, but it's a slow process.

alternatives are creating our own non-profit or seek other entities to be under.
-->

---
layout: cover
---

# Recent & upcoming features

<!--
Recent features:
- dark mode
- better archiving infrastructure
- download metrics

in progress and upcoming features:
- revamped search
    - scope wide symbol search
    - global symbol search
- changelog gen & diff

-->

---
layout: cover
transition: fade-out
background: "#f7df1eff"
---

# <span class="text-black">Let's take a look</span>

---
layout: quote
---

# Thanks

We have bi-weekly open working group meetings / office hours.

https://deno.co/jsr-meeting

<br />

https://jsr.io

https://github.com/jsr-io/jsr
