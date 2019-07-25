# Vue的项目目录以及文件的作用

```js
├─compiler
│  │  codeframe.js
│  │  create-compiler.js
│  │  error-detector.js
│  │  helpers.js
│  │  index.js
│  │  optimizer.js
│  │  to-function.js
│  │
│  ├─codegen
│  │      events.js
│  │      index.js
│  │
│  ├─directives
│  │      bind.js
│  │      index.js
│  │      model.js
│  │      on.js
│  │
│  └─parser
│          entity-decoder.js
│          filter-parser.js
│          html-parser.js
│          index.js
│          text-parser.js
│
├─core
│  │  config.js
│  │  index.js
│  │
│  ├─components
│  │      index.js
│  │      keep-alive.js
│  │
│  ├─global-api
│  │      assets.js
│  │      extend.js
│  │      index.js
│  │      mixin.js
│  │      use.js
│  │
│  ├─instance
│  │  │  events.js
│  │  │  index.js
│  │  │  init.js
│  │  │  inject.js
│  │  │  lifecycle.js
│  │  │  proxy.js
│  │  │  render.js
│  │  │  state.js
│  │  │
│  │  └─render-helpers
│  │          bind-dynamic-keys.js
│  │          bind-object-listeners.js
│  │          bind-object-props.js
│  │          check-keycodes.js
│  │          index.js
│  │          render-list.js
│  │          render-slot.js
│  │          render-static.js
│  │          resolve-filter.js
│  │          resolve-scoped-slots.js
│  │          resolve-slots.js
│  │
│  ├─observer
│  │      array.js
│  │      dep.js
│  │      index.js
│  │      scheduler.js
│  │      traverse.js
│  │      watcher.js
│  │
│  ├─util
│  │      debug.js
│  │      env.js
│  │      error.js
│  │      index.js
│  │      lang.js
│  │      next-tick.js
│  │      options.js
│  │      perf.js
│  │      props.js
│  │
│  └─vdom
│      │  create-component.js
│      │  create-element.js
│      │  create-functional-component.js
│      │  patch.js
│      │  vnode.js
│      │
│      ├─helpers
│      │      extract-props.js
│      │      get-first-component-child.js
│      │      index.js
│      │      is-async-placeholder.js
│      │      merge-hook.js
│      │      normalize-children.js
│      │      normalize-scoped-slots.js
│      │      resolve-async-component.js
│      │      update-listeners.js
│      │
│      └─modules
│              directives.js
│              index.js
│              ref.js
│
├─platforms
│  ├─web
│  │  │  entry-compiler.js
│  │  │  entry-runtime-with-compiler.js
│  │  │  entry-runtime.js
│  │  │  entry-server-basic-renderer.js
│  │  │  entry-server-renderer.js
│  │  │
│  │  ├─compiler
│  │  │  │  index.js
│  │  │  │  options.js
│  │  │  │  util.js
│  │  │  │
│  │  │  ├─directives
│  │  │  │      html.js
│  │  │  │      index.js
│  │  │  │      model.js
│  │  │  │      text.js
│  │  │  │
│  │  │  └─modules
│  │  │          class.js	// 对标签上的class进行处理
│  │  │          index.js
│  │  │          model.js // input标签的v-if-else链进行处理
│  │  │          style.js	// 对标签上的style属性进行处理
│  │  │
│  │  ├─runtime
│  │  │  │  class-util.js
│  │  │  │  index.js
│  │  │  │  node-ops.js
│  │  │  │  patch.js
│  │  │  │  transition-util.js
│  │  │  │
│  │  │  ├─components
│  │  │  │      index.js
│  │  │  │      transition-group.js
│  │  │  │      transition.js
│  │  │  │
│  │  │  ├─directives
│  │  │  │      index.js
│  │  │  │      model.js
│  │  │  │      show.js
│  │  │  │
│  │  │  └─modules
│  │  │          attrs.js
│  │  │          class.js
│  │  │          dom-props.js
│  │  │          events.js
│  │  │          index.js
│  │  │          style.js
│  │  │          transition.js
│  │  │
│  │  ├─server
│  │  │  │  compiler.js
│  │  │  │  util.js
│  │  │  │
│  │  │  ├─directives
│  │  │  │      index.js
│  │  │  │      model.js
│  │  │  │      show.js
│  │  │  │
│  │  │  └─modules
│  │  │          attrs.js
│  │  │          class.js
│  │  │          dom-props.js
│  │  │          index.js
│  │  │          style.js
│  │  │
│  │  └─util
│  │          attrs.js
│  │          class.js
│  │          compat.js
│  │          element.js
│  │          index.js
│  │          style.js
│  │
│  └─weex
│      │  entry-compiler.js
│      │  entry-framework.js
│      │  entry-runtime-factory.js
│      │
│      ├─compiler
│      │  │  index.js
│      │  │
│      │  ├─directives
│      │  │      index.js
│      │  │      model.js
│      │  │
│      │  └─modules
│      │      │  append.js
│      │      │  class.js
│      │      │  index.js
│      │      │  props.js
│      │      │  style.js
│      │      │
│      │      └─recycle-list
│      │              component-root.js
│      │              component.js
│      │              index.js
│      │              recycle-list.js
│      │              text.js
│      │              v-bind.js
│      │              v-for.js
│      │              v-if.js
│      │              v-on.js
│      │              v-once.js
│      │
│      ├─runtime
│      │  │  index.js
│      │  │  node-ops.js
│      │  │  patch.js
│      │  │  text-node.js
│      │  │
│      │  ├─components
│      │  │      index.js
│      │  │      richtext.js
│      │  │      transition-group.js
│      │  │      transition.js
│      │  │
│      │  ├─directives
│      │  │      index.js
│      │  │
│      │  ├─modules
│      │  │      attrs.js
│      │  │      class.js
│      │  │      events.js
│      │  │      index.js
│      │  │      style.js
│      │  │      transition.js
│      │  │
│      │  └─recycle-list
│      │          render-component-template.js
│      │          virtual-component.js
│      │
│      └─util
│              element.js
│              index.js
│              parser.js
│
├─server
│  │  create-basic-renderer.js
│  │  create-renderer.js
│  │  render-context.js
│  │  render-stream.js
│  │  render.js
│  │  util.js
│  │  write.js
│  │
│  ├─bundle-renderer
│  │      create-bundle-renderer.js
│  │      create-bundle-runner.js
│  │      source-map-support.js
│  │
│  ├─optimizing-compiler
│  │      codegen.js
│  │      index.js
│  │      modules.js
│  │      optimizer.js
│  │      runtime-helpers.js
│  │
│  ├─template-renderer
│  │      create-async-file-mapper.js
│  │      index.js
│  │      parse-template.js
│  │      template-stream.js
│  │
│  └─webpack-plugin
│          client.js
│          server.js
│          util.js
│
├─sfc
│      parser.js
│
└─shared
        constants.js
        util.js

```

