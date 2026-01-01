---
title: "Deno Wrapped: What happened in Deno this year"
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
layout: cover
---

# Deno Wrapped

<br />

## What happened in Deno this year

---
layout: intro-image
image: /leo.jpg
clicksStart: 1
---

# Leo Kettmeir

<div class="[&>*]:important-leading-10 opacity-80 pl-4">

Engineer at <span v-mark.auto.blue=0>Deno</span>

Implemented various Web APIs, including WebGPU & URLPattern

</div>

---
layout: cover
---

## Timeline

![alt](/release_timeline.svg)

---
layout: fact
---

## So what has happened since 2.0.0?

---

- massively improved node compatability
- Native support for package.json and node_modules
- More extensive package management: `deno install` (completely reworked from
  previous behaviour), `deno add`, and `deno remove`
- Stabilized standard library
- Monorepo support
- and many other things, including improvements to all subcommands

<TimelineIndicator version="0" />

---

## WASM imports

<br />

````md magic-move
```ts
const wasmInstance = WebAssembly.instantiateStreaming(fetch("./add.wasm"));
const { add } = wasmInstance;

console.log(add(1, 2));
// $ deno --allow-read main.ts
// 3
```

```ts
import { add } from "./add.wasm";

console.log(add(1, 2));
// $ deno main.ts
// 3
```

```ts
import { add } from "./add.wasm";

console.log(add(1, ""));
```
````

<br />

<div v-click>

```
$ deno check main.ts
Check file:///main.ts
error: TS2345 [ERROR]: Argument of type 'string' is not assignable to parameter of type 'number'.
console.log(add(1, ""));
                   ~~
    at file:///main.ts:3:20
```

</div>

<TimelineIndicator version="1" />

<!--
With Deno 2.1 we added WASM imports, which let you statically import WASM, meaning you dont have to specify permissions anymore to use WASM.

[click:2] Additionally, Deno understands WASM such that it can type check the code using WASM
-->

---

## Embedded assets in `deno compile`

<br />

```
$ deno compile --include ./names.csv --include ./data/ main.ts
```

<br />

```ts
import { parse } from "jsr:@std/csv/parse";
const names = Deno.readTextFile(import.meta.dirname + "/names.csv");
const csvData = parse(names);

const dataFiles = Deno.readDir(import.meta.dirname + "/data");
for (const file of dataFiles) {
  // ...do something with each file
}
```

<TimelineIndicator version="1" />

<!--

One of the most requested features for deno compile was ability to embed arbitrary files that can be read by the compiled program. Thanks to a major overhaul of the internal infrastructure of deno compile, this was made possible.

-->

---

## Permission prompts stack traces

![alt](/permission_trace.svg)

<TimelineIndicator version="1" />

---
layout: two-cols-header
---

## Deno task enhancements

::left::

```json
{
  "tasks": {
    "build": "deno run -RW build.ts",
    "generate": "deno run -RW generate.ts",
    "serve": {
      "command": "deno run -RN server.ts",
      "dependencies": ["build", "generate"]
    }
  }
}
```

::right::

``` {1,2,3,8}
$ deno task serve
Task build deno run -RW build.ts
Task generate deno run -RW generate.ts
Generating data...
Starting the build...
Build finished
Data generated
Task serve deno run -RN server.ts
Listening on http://localhost:8000/
```

::bottom::

<TimelineIndicator version="1" />

<style>
.two-cols-header {
  grid-template-rows: auto;
  column-gap: 20px; /* Adjust the gap size as needed */
}
</style>

---

## Open Telemetry

<br />

```ts
Deno.serve((req) => {
  console.log("Received request for", req.url);
  return new Response("Hello world");
});
```

<br />

```
$ OTEL_DENO=true deno run --unstable-otel --allow-net server.ts
```


<TimelineIndicator version="2" />

<!--

This one is a bit complicated and requires some setup.

-->

---

## Open Telemetry

<br />

<div class="flex gap-4 h-70% items-start w-full">

<img src="/otel_log.png" class="flex-image" />

<img src="/otel_trace.png" class="flex-image" />

</div>

<TimelineIndicator version="2" />

<style>
.flex-image {
    flex: 1 1 0;
    min-width: 0;
    max-width: 100%;
    max-height: 100%;
    height: auto;
    width: auto;
    object-fit: contain;
}
</style>

---

## Lint plugins

<br />

```json
{
  "lint": {
    "plugins": [
      "./my-plugin.ts",
      "jsr:@my-scope/lint-plugin",
      "npm:@my-scope/other-plugin"
    ]
  }
}
```

<TimelineIndicator version="2" />

---

## Lint plugins

````md magic-move
```ts
export default {
  name: "my-lint-plugin",
  rules: {
    "my-lint-rule": {
      create(context) {
        return {
          VariableDeclarator(node) {
            if (node.id.type === "Identifier" && node.id.name === "foo") {
              context.report({
                node,
                message: "Use more descriptive name than `foo`",
              });
            }
          },
        };
      },
    },
  },
} satisfies Deno.lint.Plugin;
```

```ts
export default {
  name: "my-lint-plugin",
  rules: {
    "my-lint-rule": {
      create(context) {
        return {
          'VariableDeclarator[id.name="foo"]'(node) {
            context.report({
              node,
              message: "Use more descriptive name than `foo`",
            });
          },
        };
      },
    },
  },
} satisfies Deno.lint.Plugin;
```
````

<TimelineIndicator version="2" />

---

## 2.3: the improvements update

<br />

```json
{
  "links": [
    "../path/to/local_npm_package"
  ]
}
```

<br />

<v-clicks>

- `deno compile` supports FFI & `Deno.build.standalone`
- more `deno fmt` options & tagged templates support
- easier `deno check` usage
- windows code signing
- Open Telemetry auto-instrumentation for `node:http` traces & V8 JS engine metrics
- Open Telemetry span context propagators

</v-clicks>


<!--
To use local npm modules, you’ll need a local node_modules folder, which you can achieve with either "nodeModulesDir": "auto" or "nodeModulesDir": "manual".
-->


<TimelineIndicator version="3" />

--- 

## `deno bundle`



<br />

Uses esbuild under the hood!

<br />

<v-clicks>

<div>

```
$ deno bundle --minify main.ts
```

<br />

</div>


<div>

```
$ deno bundle --platform browser --output bundle.js app.jsx
```

<br />

</div>

```
$ deno bundle --platform browser --output bundle.js --sourcemap=external app.jsx
```

</v-clicks>


<TimelineIndicator version="4" />

<!--

most requested feature.

backed by esbuild.

platform defaults to deno.


-->

---

## Text & Bytes imports


<v-switch>
<template #1>

```ts
const image = Deno.readFileSync(import.meta.resolve("./image.png"));
const text = await Deno.readTextFile(import.meta.resolve("./log.txt"));
```

</template>
<template #2-4>

```ts
import message from "./hello.txt" with { type: "text" };
import bytes from "./hello.txt" with { type: "bytes" };
import imageBytes from "./image.png" with { type: "bytes" };
```

</template>
</v-switch>


<v-click at="3">

```ts
console.log("Message:", message);
// Message: Hello, Deno!

console.log("Bytes:", bytes);
// Bytes: Uint8Array(12) [ 72, 101, 108, 108, 111, 44, 32, 68, 101, 110, 111, 33 ]

Deno.serve((_req) => {
return new Response(imageBytes, {
status: 200,
headers: {
"Content-Type": "image/png",
"Content-Length": imageBytes.byteLength.toString(),
},
});
});
// Shows image.png at localhost:8000
```

</v-click>


<!--
Supported in deno bundle & deno compile.

nextjs and other frameworks support these & more, their approaches are not spec-friendly and introduce unnecessary complexity via domain-specific languages and ahead-of-time compilers that modify the language. 

We’ve wanted to add importing other file types earlier, but also want to be aligned with the spec and avoid introducing breaking changes.
Some people might know that this feature actually goes ahead of current spec.
However, due to ongoing discussions and proposed upcoming features about this feature, we are confident this implementation is in the right direction.
-->

<TimelineIndicator version="4" />

---

## Permission system improvements

<br />

```
$ deno --allow-net=*.foo.localhost subdomain_wildcards.ts
```

<br />

```
$ deno --allow-net=192.168.0.128/25 main.ts
```

<br />
<br />

<v-click>

```
$ deno --deny-import=cdn.jsdelivr.net main.ts
```

</v-click>

<TimelineIndicator version="4" />

<!--

[click] Deno 2 added --allow-import flag that allows you to specify which remote hosts Deno can download and execute code from.

-->

---

## More node globals

<br />

- Buffer
- global
- setImmediate
- clearImmediate

<TimelineIndicator version="4" />

---

## Permissions in config file

<br/>

````md magic-move
```jsonc
{
  "permissions": {
    "process-data": {
      "read": ["./data"],
      "write": ["./data"]
    }
    // ...more permissions can be defined here by name...
  },
  "tasks": {
    "dev": "deno run -P=process-data main.ts"
  }
}
```

```jsonc
{
  "permissions": {
    "default": {
      "read": ["./deno.json"],
      "env": true,
      "run": {
        "allow": ["git"]
      }
    }
  },
  "test": {
    "permissions": {
      "read": ["./data"]
    }
  }
}
```
````


<TimelineIndicator version="5" />


<!--
-P flag needs to be set to use the permissions from the config file.
-->

---

## Permission audit log

<br />

```
$ DENO_AUDIT_PERMISSIONS=./permission.log deno run -A main.ts
```

<br />

```jsonl
{ "v": 1, "datetime": "2025-09-05T12:12:35Z", "permission": "env", "value": "FOO" }
{ "v": 1, "datetime": "2025-09-05T12:14:18Z", "permission": "read", "value": "data.csv" }
{ "v": 1, "datetime": "2025-09-05T12:14:26Z", "permission": "write", "value": "log.txt" }
```
<br />

```json
{
  "v": 1,
  "datetime": "2025-09-05T12:12:35Z",
  "permission": "env",
  "value": "FOO"
}
```


<TimelineIndicator version="5" />

<!--
This can be combined with the env var DENO_TRACE_PERMISSIONS=1, which will also add the stack trace for permission requests to the audit log.
-->

---

## `Deno.bundle`

<br />

```tsx
import { render } from "npm:preact";
import "./styles.css";

const app = (
  <div>
    <p>Hello World!</p>
  </div>
);

render(app, document.body);
```

```ts
const result = await Deno.bundle({
  entrypoints: ["./index.tsx"],
  outputDir: "dist",
  platform: "browser",
  minify: true,
});
console.log(result);
```


<TimelineIndicator version="5" />

---

## WebSocket headers

<br />
<br />

```ts
const ws = new WebSocket("wss://api.example.com/socket", {
  headers: new Headers({
    "Authorization": `Bearer ${token}`,
    "X-Custom": "value",
  }),
});
```

<TimelineIndicator version="5" />

---

## Dependency management

<br/>


<img src="/deno_install_summary.png" class="h-70% w-auto" />


<TimelineIndicator version="5" />


---

## `deno deploy` subcommand

<br />

```
$ deno deploy
```

<br />

```
create           [root-path]                   - Create a new application
env                                            - Modify environmental variables
  list                                           - List all environmental variables in an application
  add              <variable> <value>            - Add an environmental variable to the application
  update-value     <variable> <value>            - Update the value of an environmental variable in the application
  update-contexts  <variable> [new-contexts...]  - Update the contexts of an environmental variable in the application
  delete           <string>                      - Delete an environmental variable in the application
  load             <file>                        - Load environmental variables from a .env file into the application

logs                                           - Stream logs from an application
setup-aws        [contexts]                    - Setup AWS
setup-gcp        [contexts]                    - Setup GCP
logout                                         - Revoke the Deno Deploy token if one is present.
```

<TimelineIndicator version="5" />

---

## Deno Standard Library

<v-clicks>

- `std/cli`

  interactive utils (`promptSelect`, `promptMultipleSelect`, `Spinner`, `ProgressBar`)

- `std/testing`

  inline snapshot testing (`assertInlineSnapshot`)

- `std/fs`

  Node.js compatibility has been added (Deno compat basic FS APIs are available in Node)

- new packages

  `std/random`, `std/cbor`


</v-clicks>

---

## JSR

<br/>

<v-clicks>

- governance board was formed and announced
- onboarded external moderators
- yarn, pnpm & vlt have added native support
- dark-mode
- in-depth download chart
- built-in ticketing system

<div>
<br/>

### Coming soon

<br/>
</div>

- started collaboration with socket.dev for security reporting
- GitLab sign-in
- easy overview of all licenses used by a package and its dependencies

</v-clicks>

---
layout: two-cols-header
---

# Thanks


::left::

https://deno.com

<br />

https://github.com/denoland/deno

::right::

<div class="flex flex-col items-end gap-4 mb-4">

https://talks.kettmeir.dev/2025/jsconfjp

<img src="/qrcode.svg" alt="slides" class="ml-auto">

</div>