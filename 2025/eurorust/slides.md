---
title: "From any to this: Using concrete error types instead of a catchall"
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
layout: cover
---

## From `any` to `this`

<br />

## Using concrete error types instead of a catchall

<br />

<v-clicks>

## ***WITH MORE MACROS***

</v-clicks>

---
layout: intro-image
image: /leo.jpg
clicksStart: 1
---

# Leo Kettmeir

<div class="[&>*]:important-leading-10 opacity-80 pl-4">

Engineer at <span v-mark.auto.blue=0>Deno</span>

Implemented various Web APIs, including WebGPU

</div>

---
layout: cover
---

# So, what happened?

<!--
Some background first: Deno is a big project.
-->

---
layout: three-cols
class: text-xs text-left leading-none p-0.5
---

::left::
- deno
  - deno_broadcast_channel
  - deno_cache
  - deno_canvas
  - deno_config
  - deno_console
  - deno_cron
  - deno_crypto
  - deno_features
  - deno_fetch
  - deno_ffi
  - deno_fs
  - deno_http
  - deno_io
  - deno_kv
  - deno_lib

::middle::

- deno 
  - deno_maybe_sync
  - deno_napi
  - deno_net
  - deno_node
  - deno_os
  - deno_package_json
  - deno_permissions
  - deno_process
  - deno_resolver
  - deno_runtime
  - deno_signals
  - deno_telemetry
  - deno_tls
  - deno_url
  - deno_web

::right:: 

- deno_ast
- deno_cache_dir
- deno_core
  - deno_ops
- deno_doc
- deno_graph
- deno_lint
- deno_lockfile
- deno_media_type
- deno_npm
- deno_path_util
- deno_semver
- deno_task_shell
- deno_terminal
- deno_unsync

<style>
p {
  margin: 0 !important;
}
</style>


---
layout: cover
class: text-center
---

# 15,607,703 lines of Rust

6,456,306 lines of JavaScript™ & TypeScript

---

```rust {5}
let result = tools::run::run_script(WorkerExecutionMode::Run, flags.clone(), run_flags.watch).await;
match result {
  Ok(v) => Ok(v),
  Err(script_err) => {
    if script_err.to_string().starts_with(MODULE_NOT_FOUND) {
      let mut new_flags = flags.deref().clone();
      let task_flags = TaskFlags {
        cwd: None,
        task: Some(run_flags.script.clone()),
      };
      new_flags.subcommand = DenoSubcommand::Task(task_flags.clone());
      let result = tools::task::execute_script(Arc::new(new_flags), task_flags.clone(), true).await;
      match result {
        Ok(v) => Ok(v),
        Err(_) => {
          // Return script error for backwards compatibility.
          Err(script_err)
        }
      }
    } else {
      Err(script_err)
    }
  },
}
```

---
layout: cover
---

# The problem

<!--

- Deno is built on top of V8
- everything goes through our magical "ops"

-->

---
layout: cover
---

```rust
#[op2]
#[string]
pub fn op_fs_cwd(state: &mut OpState) -> Result<String, FsOpsError> {
  // some logic
}
```

---

## The old way

```rust {*}{maxHeight:'400px'}
// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.

//! There are many types of errors in Deno:
//! - AnyError: a generic wrapper that can encapsulate any type of error.
//! - JsError: a container for the error message and stack trace for exceptions
//!   thrown in JavaScript code. We use this to pretty-print stack traces.
//! - Diagnostic: these are errors that originate in TypeScript's compiler.
//!   They're similar to JsError, in that they have line numbers. But
//!   Diagnostics are compile-time type errors, whereas JsErrors are runtime
//!   exceptions.

use deno_core::error::AnyError;
use deno_core::serde_json;
use deno_core::url;
use deno_core::ModuleResolutionError;
use deno_fetch::reqwest;
use std::env;
use std::error::Error;
use std::io;
use std::sync::Arc;

fn get_dlopen_error_class(error: &dlopen::Error) -> &'static str {
  use dlopen::Error::*;
  match error {
    NullCharacter(_) => "InvalidData",
    OpeningLibraryError(ref e) => get_io_error_class(e),
    SymbolGettingError(ref e) => get_io_error_class(e),
    AddrNotMatchingDll(ref e) => get_io_error_class(e),
    NullSymbol => "NotFound",
  }
}

fn get_env_var_error_class(error: &env::VarError) -> &'static str {
  use env::VarError::*;
  match error {
    NotPresent => "NotFound",
    NotUnicode(..) => "InvalidData",
  }
}

fn get_io_error_class(error: &io::Error) -> &'static str {
  use io::ErrorKind::*;
  match error.kind() {
    NotFound => "NotFound",
    PermissionDenied => "PermissionDenied",
    ConnectionRefused => "ConnectionRefused",
    ConnectionReset => "ConnectionReset",
    ConnectionAborted => "ConnectionAborted",
    NotConnected => "NotConnected",
    AddrInUse => "AddrInUse",
    AddrNotAvailable => "AddrNotAvailable",
    BrokenPipe => "BrokenPipe",
    AlreadyExists => "AlreadyExists",
    InvalidInput => "TypeError",
    InvalidData => "InvalidData",
    TimedOut => "TimedOut",
    Interrupted => "Interrupted",
    WriteZero => "WriteZero",
    UnexpectedEof => "UnexpectedEof",
    Other => "Error",
    WouldBlock => unreachable!(),
    // Non-exhaustive enum - might add new variants
    // in the future
    _ => "Error",
  }
}

fn get_module_resolution_error_class(
  _: &ModuleResolutionError,
) -> &'static str {
  "URIError"
}

fn get_notify_error_class(error: &notify::Error) -> &'static str {
  use notify::ErrorKind::*;
  match error.kind {
    Generic(_) => "Error",
    Io(ref e) => get_io_error_class(e),
    PathNotFound => "NotFound",
    WatchNotFound => "NotFound",
    InvalidConfig(_) => "InvalidData",
    MaxFilesWatch => "Error",
  }
}

fn get_regex_error_class(error: &regex::Error) -> &'static str {
  use regex::Error::*;
  match error {
    Syntax(_) => "SyntaxError",
    CompiledTooBig(_) => "RangeError",
    _ => "Error",
  }
}

fn get_request_error_class(error: &reqwest::Error) -> &'static str {
  error
    .source()
    .and_then(|inner_err| {
      (inner_err
        .downcast_ref::<io::Error>()
        .map(get_io_error_class))
      .or_else(|| {
        inner_err
          .downcast_ref::<serde_json::error::Error>()
          .map(get_serde_json_error_class)
      })
      .or_else(|| {
        inner_err
          .downcast_ref::<url::ParseError>()
          .map(get_url_parse_error_class)
      })
    })
    .unwrap_or("Http")
}

fn get_serde_json_error_class(
  error: &serde_json::error::Error,
) -> &'static str {
  use deno_core::serde_json::error::*;
  match error.classify() {
    Category::Io => error
      .source()
      .and_then(|e| e.downcast_ref::<io::Error>())
      .map(get_io_error_class)
      .unwrap(),
    Category::Syntax => "SyntaxError",
    Category::Data => "InvalidData",
    Category::Eof => "UnexpectedEof",
  }
}

fn get_url_parse_error_class(_error: &url::ParseError) -> &'static str {
  "URIError"
}

fn get_hyper_error_class(_error: &hyper::Error) -> &'static str {
  "Http"
}

#[cfg(unix)]
pub fn get_nix_error_class(error: &nix::Error) -> &'static str {
  match error {
    nix::Error::ECHILD => "NotFound",
    nix::Error::EINVAL => "TypeError",
    nix::Error::ENOENT => "NotFound",
    nix::Error::ENOTTY => "BadResource",
    nix::Error::EPERM => "PermissionDenied",
    nix::Error::ESRCH => "NotFound",
    nix::Error::UnknownErrno => "Error",
    &nix::Error::ENOTSUP => unreachable!(),
    _ => "Error",
  }
}

pub fn get_error_class_name(e: &AnyError) -> Option<&'static str> {
  deno_core::error::get_custom_error_class(e)
    .or_else(|| deno_webgpu::error::get_error_class_name(e))
    .or_else(|| deno_web::get_error_class_name(e))
    .or_else(|| deno_webstorage::get_not_supported_error_class_name(e))
    .or_else(|| deno_websocket::get_network_error_class_name(e))
    .or_else(|| {
      e.downcast_ref::<dlopen::Error>()
        .map(get_dlopen_error_class)
    })
    .or_else(|| e.downcast_ref::<hyper::Error>().map(get_hyper_error_class))
    .or_else(|| {
      e.downcast_ref::<Arc<hyper::Error>>()
        .map(|e| get_hyper_error_class(e))
    })
    .or_else(|| {
      e.downcast_ref::<deno_core::Canceled>().map(|e| {
        let io_err: io::Error = e.to_owned().into();
        get_io_error_class(&io_err)
      })
    })
    .or_else(|| {
      e.downcast_ref::<env::VarError>()
        .map(get_env_var_error_class)
    })
    .or_else(|| e.downcast_ref::<io::Error>().map(get_io_error_class))
    .or_else(|| {
      e.downcast_ref::<ModuleResolutionError>()
        .map(get_module_resolution_error_class)
    })
    .or_else(|| {
      e.downcast_ref::<notify::Error>()
        .map(get_notify_error_class)
    })
    .or_else(|| {
      e.downcast_ref::<reqwest::Error>()
        .map(get_request_error_class)
    })
    .or_else(|| e.downcast_ref::<regex::Error>().map(get_regex_error_class))
    .or_else(|| {
      e.downcast_ref::<serde_json::error::Error>()
        .map(get_serde_json_error_class)
    })
    .or_else(|| {
      e.downcast_ref::<url::ParseError>()
        .map(get_url_parse_error_class)
    })
    .or_else(|| {
      #[cfg(unix)]
      let maybe_get_nix_error_class =
        || e.downcast_ref::<nix::Error>().map(get_nix_error_class);
      #[cfg(not(unix))]
      let maybe_get_nix_error_class = || Option::<&'static str>::None;
      (maybe_get_nix_error_class)()
    })
}
```

---
layout: cover
---

# The solution

redo everything and create yet another crate

<!--
- anyhow is anyerror
- anyhow app vs thiserror lib

-->

---

## Creating a new error definition crate

![alt](/deno_error.png)

---
layout: cover
---

- Works together with thiserror
- adds a new trait and some structs
- Adds a macro with 3 attributes

---

## Traits and other structures

<br />

```rust {all|4|6|10|8|13,14|16,17,18,19}
pub trait JsErrorClass:
  std::error::Error + Send + Sync + Any + 'static
{
  fn get_class(&self) -> Cow<'static, str>;

  fn get_message(&self) -> Cow<'static, str>;

  fn get_additional_properties(&self) -> AdditionalProperties;

  fn get_ref(&self) -> &(dyn std::error::Error + Send + Sync + 'static);
}

pub type AdditionalProperties =
  Box<dyn Iterator<Item = (Cow<'static, str>, PropertyValue)>>;

pub enum PropertyValue {
  String(Cow<'static, str>),
  Number(f64),
}
```

---
layout: cover
---

```rust
enum JsErrorBoxInner {
  Standalone {
    class: Cow<'static, str>,
    message: Cow<'static, str>,
  },
  Wrap(Box<dyn JsErrorClass>),
}

pub struct JsErrorBox(JsErrorBoxInner);

impl JsErrorBox {
  pub fn new(
    class: impl Into<Cow<'static, str>>,
    message: impl Into<Cow<'static, str>>,
  ) -> Self {}

  pub fn from_err<T: JsErrorClass>(err: T) -> Self {}

  pub fn generic(message: impl Into<Cow<'static, str>>) -> JsErrorBox {}

  pub fn type_error(message: impl Into<Cow<'static, str>>) -> JsErrorBox {}

  pub fn range_error(message: impl Into<Cow<'static, str>>) -> JsErrorBox {}

  pub fn uri_error(message: impl Into<Cow<'static, str>>) -> JsErrorBox {}
}
```

<!--

The nice (and extremely viral thing) about anyhow is inline error creation 

-->


---
class: text-sm
---
## Example

```rust
#[derive(Debug, thiserror::Error, deno_error::JsError)]
pub enum WebsocketError {
  #[class(inherit)]
  #[error(transparent)]
  Url(url::ParseError),
  #[class(inherit)]
  #[error(transparent)]
  Permission(#[from] PermissionCheckError),
  #[class(inherit)]
  #[error("{0}")]
  Io(#[from] std::io::Error),
  #[class(type)]
  #[error(transparent)]
  WebSocket(#[from] fastwebsockets::WebSocketError),
  #[class("DOMExceptionNetworkError")]
  #[error("failed to connect to WebSocket: {0}")]
  ConnectionFailed(#[from] HandshakeError),
  #[class(inherit)]
  #[error(transparent)]
  Canceled(#[from] deno_core::Canceled),
}
```

---
layout: three-cols
class: text-sm
---

## The macro

::left::

<JumpContent title="class">

The class name. Some special identifiers are available as short-hands for built-in error classes.
Alternatively, a string literal can be passed which is the error class name.

```rust
#[derive(deno_error::JsError)]
pub enum SomeError {
  #[class(generic)]
  #[error("Warning")]
  Warning(u32),
  #[class("FatalError")]
  #[error("unexpected fatal code")]
  Fatal(u32),
}
```

</JumpContent>

::middle::

<JumpContent title="property">

A way to declare a field as a property, or used at the top-level to define a property.

```rust 
#[derive(deno_error::JsError)]
pub enum SomeError {
  #[error("Warning")]
  Warning(#[property = "code"] u32),
}
```

```rust
#[derive(deno_error::JsError)]
#[property("code" = 10)]
#[class(generic)]
#[error(transparent)]
pub struct SomeError(std::io::Error);
```

</JumpContent>

::right::


<JumpContent title="inherit">

Inherit class name and properties from an error.

```rust
#[derive(deno_error::JsError)]
pub enum SomeError {
  #[class(inherit)]
  #[error(transparent)]
  Io(#[inherit] std::io::Error),
}
```

</JumpContent>

<!--

inherit is similar to 'transparent' in thiserror


Macro good practices

- syn is your friend
- PLEASE PROPAGATE YOUR ERRORS


op2 macro is 6000 lines, with custom errors, but doesnt properly propagate syn's errors, this makes errors in IDEs halfway useless.


-->

---

```rust {*}{maxHeight:'450px'}
pub fn to_v8_error<'a>(
  scope: &mut v8::HandleScope<'a>,
  error: &dyn JsErrorClass,
) -> v8::Local<'a, v8::Value> {
  let tc_scope = &mut v8::TryCatch::new(scope);
  let cb = JsRealm::exception_state_from_scope(tc_scope)
    .js_build_custom_error_cb
    .borrow()
    .clone()
    .expect("Custom error builder must be set");
  let cb = cb.open(tc_scope);
  let this = v8::undefined(tc_scope).into();
  let class = v8::String::new(tc_scope, &error.get_class()).unwrap();
  let message = v8::String::new(tc_scope, &error.get_message()).unwrap();
  let mut args = vec![class.into(), message.into()];

  let additional_properties = error
    .get_additional_properties()
    .map(|(key, value)| {
      let key = v8::String::new(tc_scope, &key).unwrap().into();
      let value = match value {
        PropertyValue::String(value) => {
          v8::String::new(tc_scope, &value).unwrap().into()
        }
        PropertyValue::Number(value) => v8::Number::new(tc_scope, value).into(),
      };

      v8::Array::new_with_elements(tc_scope, &[key, value]).into()
    })
    .collect::<Vec<_>>();

  if !additional_properties.is_empty() {
    args.push(
      v8::Array::new_with_elements(tc_scope, &additional_properties).into(),
    );
  }

  let maybe_exception = cb.call(tc_scope, this, &args);

  match maybe_exception {
    Some(exception) => exception,
    None => {
      let mut msg =
        "Custom error class must have a builder registered".to_string();
      if tc_scope.has_caught() {
        let e = tc_scope.exception().unwrap();
        let js_error = JsError::from_v8_exception(tc_scope, e);
        msg = format!("{}: {}", msg, js_error.exception_message);
      }
      panic!("{}", msg);
    }
  }
}
```

---
layout: cover
---

## A second friend in town

<v-clicks>

![alt](/boxed_error.png)

</v-clicks>

---

```rust {*}{maxHeight:'450px'}
use thiserror::Error;

#[derive(Error, Debug)]
#[error(transparent)]
pub struct DenoResolveError(pub Box<DenoResolveErrorKind>);

impl DenoResolveError {
  pub fn as_kind(&self) -> &DenoResolveErrorKind {
    &self.0
  }

  pub fn into_kind(self) -> DenoResolveErrorKind {
    *self.0
  }
}

impl<E> From<E> for DenoResolveError
where
  DenoResolveErrorKind: From<E>,
{
  fn from(err: E) -> Self {
    DenoResolveError(Box::new(DenoResolveErrorKind::from(err)))
  }
}

#[derive(Debug, Error)]
pub enum DenoResolveErrorKind {
  #[error("Importing ...")]
  InvalidVendorFolderImport,
  #[error(transparent)]
  MappedResolution(#[from] MappedResolutionError),
  // ...
}

impl DenoResolveErrorKind {
  pub fn into_box(self) -> DenoResolveError {
    DenoResolveError(Box::new(self))
  }
}
```

---
layout: cover
---

```rust
use boxed_error::Boxed;
use thiserror::Error;

#[derive(Debug, Boxed)]
pub enum DenoResolveError(pub Box<DenoResolveErrorKind>);

#[derive(Debug, Error)]
pub enum DenoResolveErrorKind {
  #[error("Importing ...")]
  InvalidVendorFolderImport,
  #[error(transparent)]
  MappedResolution(#[from] MappedResolutionError),
  // ...
}
```

---
layout: cover
---

## Outcome

<br />

<v-clicks>

- much easier tracking of where errors are originating from, especially panics
- errors are now actually defined somewhere
- more predictable outcome from individual functions
- increase of the Deno binary
- performance: ???

</v-clicks>

<!--
- performance difference isnt know, but due to the reduced dynamic downcasting, i assume it would be slightly faster

-->

---
layout: quote
---

"From Rust to JavaScript - communicating errors across language boundaries sounds like black magic and it probably is, but Deno's JsError elegantly bridges the gap and makes it look easy along the way.🪄"

<p v-click>or alternatively said:</p>

<p v-after>"pretty neat refactoring😅"</p>

<br />

Matthias Reisinger, Dynatrace

---
layout: quote
---

## Rewriting errors from anyhow to thiserror

<br />

<v-clicks>

```rust
    if script_err.to_string().starts_with(MODULE_NOT_FOUND) {
```


</v-clicks>

<!--

- anyhow app vs thiserror lib
- fuck anyhow. even for apps. i'll still end up using it though. 
- dont transparent everything
- you might start creating errors for everything and defining too many errors
- nesting errors is fine, but box 'em!

-->

---
layout: quote
---

# Thanks

<br />

https://deno.com

https://github.com/denoland/deno

https://github.com/denoland/deno_error